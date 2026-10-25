# Califnco Round 1 — submission status

**Date:** 25 October 2026  
**Status:** Partially ready. The APK is built. The submission still needs public project links, real recordings, and your personal details.

## Ready now

- **Android APK:** [Download Califnco Aqua APK](https://expo.dev/artifacts/eas/bMVVSjl357nxUCJKh7pB2YvS2dTUoXy4ShVoR9X3beo.apk) (56.5 MB)
- **Expo build page:** https://expo.dev/accounts/ishowspeed7/projects/califnco-aqua/builds/86a74c0c-dd37-4bc0-af57-274b9fb48240
- **Admin website source:** in the project’s `admin/` folder; local production build succeeded. It is not published to Vercel yet.
- **Instagram Worker:** deployed at https://califnco-aqua-daily-posts.keshavamurthy0002.workers.dev
- **Worker health:** reports `ready`.
- **Schedule:** daily at 09:00 India time.

## Still needed before you submit

1. **Install and walk through the APK** on your Android phone. Record customer and dealer flows, and include the admin panel in the screen recording.
2. **Publish the admin site on Vercel.** Vercel CLI currently reports that it is logged out, so sign in first.
3. **Create a public GitHub repository** for the project and push the source. The project source is at `C:\Users\kesava\OneDrive\Documents\projapp\Califnco-Aqua`.
4. **Verify the scheduled Instagram post** is visible on `@califncoaqua`, then record the image/caption generation and live post. The Worker health endpoint being ready does not prove a post has published.
5. Upload the APK and recordings to Google Drive and set each link to **Anyone with the link can view**.
6. Complete the official form with your own name, email, and phone number. Check all links, then submit.

Official form: https://docs.google.com/forms/d/e/1FAIpQLScmXkkKLAOCuqwMQrx5HBMrcj8wUNXZr5mOEbEF8SmfiqDRFQ/viewform

The email says the deadline is **25 October 2026**.

## Form answer drafts

**Framework:** React Native with Expo for the mobile app; React and Vite for the admin panel; Cloudflare Workers and Workers AI for Instagram automation.

**Alternative tools:** Expo, React Native, Vite, Cloudflare Workers, Workers AI, Meta Instagram Graph API, Cloudflare KV, and Vercel.

**Approach:**  
Built an Expo storefront with product browsing, customer and dealer flows, cart, service requests, order history, and a demo checkout. Created an admin dashboard for demo order, dealer, and service management. A Cloudflare Worker is scheduled to generate an AI product image and caption and publish to Instagram; verify the scheduled post before claiming the live post flow is complete.

## Be accurate in the submission

Checkout is a demo and does not collect payment. The admin dashboard displays demo/local records. Do not claim a live payment integration or verified Instagram post until you have tested them.


