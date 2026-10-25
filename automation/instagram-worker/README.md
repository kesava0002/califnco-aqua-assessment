# Califnco Aqua daily Instagram publisher

This Cloudflare Worker is the daily automation for the Round 1 assignment. At 09:00 IST it rotates through the app's 50-product catalog, generates a square product image and caption with Cloudflare Workers AI, stores both the image and duplicate-prevention marker in the existing private `MEDIA` KV namespace, then publishes one Instagram feed post through Meta's API.

## What is already in Cloudflare

The account already has the `califnco-aqua-daily-posts` Worker, an `AI` Workers AI binding, and a private `MEDIA` KV namespace. This package updates that Worker; it does not create a second Worker or a public bucket. The Worker serves only generated images from dated `/media/...jpg` paths so Instagram can fetch the image; KV itself remains private.

## Configure and deploy

1. From this folder, run `npx wrangler deploy`. Wrangler will deploy to the existing `califnco-aqua-daily-posts` Worker, keep the `AI` and `MEDIA` bindings, and configure its 09:00 IST Cron Trigger.
2. In Cloudflare, open **Workers & Pages → califnco-aqua-daily-posts → Settings → Variables and Secrets** and add:
   - Secret `META_ACCESS_TOKEN`: the Facebook Page access token for the selected Califnco Aqua Page. Keep it in Cloudflare; never put it in source or chat.
   - Variable `IG_USER_ID`: `17841451928637229` for `@califncoaqua`.
3. Verify `https://califnco-aqua-daily-posts.keshavamurthy0002.workers.dev/health` returns `status: ready`.
4. Check the Worker logs after the next scheduled time and confirm the post appears on Instagram.

This publisher uses the Facebook Login route with only `instagram_basic`, `instagram_content_publish`, `pages_show_list`, and `pages_read_engagement`. Authorization was limited to the selected Califnco Aqua Page and @califncoaqua account. Messages, comments, and insights access remain off. The Meta API calls use graph.facebook.com and a Page access token. Meta may require app review or tester approval before the app can publish beyond the app's developer/tester accounts.

## Schedule and duplicate protection

The schedule runs at 03:30 UTC (09:00 IST). A per-day state marker in the private KV namespace prevents another attempt from publishing a duplicate if Meta accepted a post but its response was lost. If the state for a date remains `publishing`, check Instagram first. Delete that single `state/YYYY-MM-DD.json` key from KV only after confirming the post does not exist.

The image and caption use Cloudflare Workers AI. Cloudflare currently lists 10,000 free neurons per day; usage limits and model availability can change. The Worker does not publish by visiting `/health` or `/media/...`; it publishes only from the scheduled trigger.

## Source checks

`node --check src/index.js` checks JavaScript syntax. The project-level source validator is `node task1-water-purifier/scripts/validate-source.cjs` from the project root.


## Token maintenance

The Worker does not renew Meta credentials automatically. Check the Page token's expiry in Meta and replace the Cloudflare META_ACCESS_TOKEN secret before it expires.