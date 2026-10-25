const CATALOG = [
  ["AquaPure RO+UV 8L", "Purifiers", "8-stage purification"],
  ["CrystalFlow RO 7L", "Purifiers", "RO + mineral balance"],
  ["PureLife UV 10L", "Purifiers", "UV protection"],
  ["AquaMax Copper RO", "Purifiers", "Copper-enriched water"],
  ["HydroGuard Smart RO", "Purifiers", "Smart filter alerts"],
  ["ClearDrop UF 7L", "Purifiers", "Low TDS water"],
  ["BlueSpring Alkaline RO", "Purifiers", "Alkaline mineralizer"],
  ["AquaZen Compact RO", "Purifiers", "Compact kitchen fit"],
  ["PureWave Hot & Cold", "Purifiers", "Hot and cold dispense"],
  ["EcoSip Gravity 20L", "Purifiers", "No electricity needed"],
  ["AquaDesk Dispenser", "Dispensers", "Tabletop dispenser"],
  ["ChillPoint Floor Dispenser", "Dispensers", "Hot and cold taps"],
  ["HydraTouch Bottle Dispenser", "Dispensers", "Easy bottle fit"],
  ["OfficeFlow Dispenser Pro", "Dispensers", "Commercial capacity"],
  ["PureChill Mini", "Dispensers", "Compact cooling"],
  ["FlowDrive 75 GPD Pump", "Pumps", "High pressure pump"],
  ["AquaLift 100 GPD Pump", "Pumps", "Heavy duty motor"],
  ["SilentFlow Booster Pump", "Pumps", "Low-noise operation"],
  ["RO Pressure Pump 24V", "Pumps", "Universal compatible"],
  ["HydroForce Pump Pro", "Pumps", "High output"],
  ["Sediment Filter 10 inch", "Filters", "Pre-filter cartridge"],
  ["Carbon Block Filter", "Filters", "Chlorine and odour reduction"],
  ["RO Membrane 75 GPD", "Filters", "High rejection membrane"],
  ["RO Membrane 100 GPD", "Filters", "High capacity membrane"],
  ["UV Lamp 11W", "Filters", "UV replacement lamp"],
  ["UF Filter Cartridge", "Filters", "UF membrane cartridge"],
  ["Alkaline Mineral Cartridge", "Filters", "Mineral enhancement"],
  ["Copper Mineral Cartridge", "Filters", "Copper mineral stage"],
  ["Post Carbon Filter", "Filters", "Final polishing filter"],
  ["Inline Sediment Filter", "Filters", "Inline pre-filter"],
  ["Antiscalant Cartridge", "Filters", "Scale protection"],
  ["TDS Controller", "Filters", "TDS adjustment"],
  ["Filter Housing 10 inch", "Spares", "Transparent housing"],
  ["RO Flow Restrictor", "Spares", "Flow control part"],
  ["Auto Shut Off Valve", "Spares", "Automatic water control"],
  ["Float Valve Kit", "Spares", "Tank level control"],
  ["SMPS 24V Adapter", "Spares", "Power supply"],
  ["Water Level Sensor", "Spares", "Tank level sensor"],
  ["Push Fit Connector Set", "Spares", "Leak-resistant fittings"],
  ["Food Grade Tubing 5m", "Spares", "Flexible tubing"],
  ["Faucet Tap Chrome", "Spares", "Replacement faucet"],
  ["Leak Stop Valve", "Spares", "Leak protection"],
  ["Booster Pump Bracket", "Spares", "Mounting bracket"],
  ["RO Membrane Housing", "Spares", "Membrane casing"],
  ["Pressure Switch", "Spares", "Pressure control"],
  ["Water Quality TDS Meter", "Accessories", "Digital TDS reading"],
  ["Leak Detector Alarm", "Accessories", "Leak alert sensor"],
  ["Filter Wrench Tool", "Accessories", "Cartridge maintenance"],
  ["Stainless Steel Bottle 1L", "Accessories", "Reusable bottle"],
  ["Water Test Strip Kit", "Accessories", "Quick water test"],
];

const IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const CAPTION_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";
const MAX_CAPTION_LENGTH = 1800;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ service: "califnco-daily-instagram", status: "ready" });
    }
    if (request.method === "GET" && url.pathname.startsWith("/media/")) {
      const key = url.pathname.slice("/media/".length);
      if (!/^posts\/\d{4}-\d{2}-\d{2}\/[a-z0-9-]+\.jpg$/.test(key)) {
        return new Response("Not found", { status: 404 });
      }
      const object = await env.MEDIA.get(key, { type: "arrayBuffer" });
      if (!object) return new Response("Not found", { status: 404 });
      return new Response(object, {
        headers: {
          "Content-Type": object.httpMetadata?.contentType || "image/jpeg",
          "Cache-Control": object.httpMetadata?.cacheControl || "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    return new Response("Not found", { status: 404 });
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(publishDailyProduct(controller.scheduledTime, env));
  },
};

async function publishDailyProduct(scheduledTime, env) {
  const date = indiaDate(new Date(scheduledTime));
  const stateKey = `state/${date}.json`;
  const prior = await env.MEDIA.get(stateKey);
  if (prior) {
    console.log(`Skipping ${date}; a daily run is already recorded.`);
    return;
  }

  const mediaBaseUrl = required(env.PUBLIC_BASE_URL, "PUBLIC_BASE_URL").replace(/\/$/, "");
  const graphRoot = `https://graph.facebook.com/${env.META_API_VERSION || "v26.0"}`;
  const accessToken = required(env.META_ACCESS_TOKEN, "META_ACCESS_TOKEN");
  const igUserId = required(env.IG_USER_ID, "IG_USER_ID");
  const dayNumber = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  const [name, category, feature] = CATALOG[((dayNumber % CATALOG.length) + CATALOG.length) % CATALOG.length];
  const caption = await generateCaption(env, name, category, feature);
  const image = await generateImage(env, name, category, feature, dayNumber);
  const objectKey = `posts/${date}/${slug(name)}.jpg`;
  await env.MEDIA.put(objectKey, image.buffer.slice(image.byteOffset, image.byteOffset + image.byteLength));

  const imageUrl = `${mediaBaseUrl}/${objectKey}`;

  const container = await graphPost(`${graphRoot}/${encodeURIComponent(igUserId)}/media`, accessToken, {
    image_url: imageUrl,
    caption,
  });
  const creationId = container.id;
  if (!creationId) throw new Error("Meta did not return a media container ID.");
  await waitForContainer(graphRoot, creationId, accessToken);

  // Save a marker before publishing. If the request times out after Meta accepts it,
  // the next scheduled run will not accidentally publish a duplicate.
  await env.MEDIA.put(stateKey, JSON.stringify({ date, status: "publishing", product: name, objectKey }));
  const published = await graphPost(`${graphRoot}/${encodeURIComponent(igUserId)}/media_publish`, accessToken, {
    creation_id: creationId,
  });
  await env.MEDIA.put(stateKey, JSON.stringify({ date, status: "published", product: name, mediaId: published.id || null, objectKey }));
  console.log(`Published daily product for ${date}: ${name}.`);
}

async function generateCaption(env, name, category, feature) {
  const result = await env.AI.run(CAPTION_MODEL, {
    messages: [
      { role: "system", content: "Write concise, friendly Instagram product captions for an Indian water purifier shop. Use only the facts supplied. Never invent health claims, certifications, performance claims, prices, warranties, or availability. Add 4 to 6 relevant hashtags. Return only the caption." },
      { role: "user", content: `Product: ${name}\nCategory: ${category}\nKnown detail: ${feature}\nBrand: Califnco Aqua` },
    ],
    max_tokens: 180,
    temperature: 0.7,
  });
  const caption = String(result?.response || "").trim();
  if (!caption) throw new Error("The caption model returned no text.");
  return caption.slice(0, MAX_CAPTION_LENGTH);
}

async function generateImage(env, name, category, feature, seed) {
  const result = await env.AI.run(IMAGE_MODEL, {
    prompt: `Square 1:1 premium commercial product photograph for a water purifier retailer. Feature the exact product type: ${name}, category ${category}. Relevant detail: ${feature}. Show one realistic, clean, centered product on a soft pale aqua studio background, soft natural reflections, accurate plausible industrial design, crisp high-end ecommerce lighting, generous empty margins. No text, no letters, no logos, no watermark, no extra products, no people.`,
    width: 512,
    height: 512,
    num_steps: 4,
    seed: Math.abs(seed % 2_147_483_647),
  });
  if (!result?.image) throw new Error("The image model returned no image.");
  const binary = atob(result.image);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function waitForContainer(graphRoot, creationId, accessToken) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const url = new URL(`${graphRoot}/${encodeURIComponent(creationId)}`);
    url.searchParams.set("fields", "status_code,status");
    url.searchParams.set("access_token", accessToken);
    const response = await fetch(url);
    const body = await readJson(response, "Check media container");
    if (body.status_code === "FINISHED") return;
    if (body.status_code === "ERROR" || body.status_code === "EXPIRED") {
      throw new Error(`Meta media container ${body.status_code.toLowerCase()}.`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error("Meta media container did not finish within 24 seconds.");
}

async function graphPost(url, accessToken, fields) {
  const body = new URLSearchParams(fields);
  body.set("access_token", accessToken);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return readJson(response, "Publish to Instagram");
}

async function readJson(response, action) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.error) {
    const message = body?.error?.message || `${action} failed (${response.status}).`;
    throw new Error(message.slice(0, 500));
  }
  return body;
}

function indiaDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function required(value, name) {
  if (!value) throw new Error(`Missing configuration: ${name}.`);
  return value;
}



