# Califnco Aqua

A React Native demo storefront for water purifiers and replacement parts.

## Start the app

1. Install Node.js LTS if it is not already installed.
2. Open this folder, then open a terminal in the mobile folder.
3. Run npm install, then npx expo start.
4. Scan the QR code with Expo Go on your phone. Keep your phone and computer on the same Wi-Fi.

## What is included

- Product catalog with working category filters and search.
- Product-specific product images, with a product-type illustration if an image cannot load.
- Dealer prices and a minimum quantity of 5 for each dealer product. The Profile screen shows only the role name.
- A Razorpay-style checkout preview for the app walkthrough. It is a demo screen only: it does not connect to Razorpay and does not take money.

Orders created from checkout are marked as demo payments and saved on this device.

## Daily Instagram automation

The assignment's scheduled product-post automation source is in [`automation/instagram-worker`](automation/instagram-worker/README.md). It still needs Cloudflare and Meta account setup, protected tokens, and an end-to-end publishing check before it can be described as live.

## Sign-in

The app uses Firebase Authentication with email and password. Firebase configuration in `mobile/firebase.js` is public client configuration, not an admin credential. Enable Email/Password under Firebase Console → Authentication → Sign-in method. Customer and dealer are demo storefront modes. The mobile Admin controls are shown only to the configured admin email, and the web Admin dashboard checks Firebase sign-in plus that email allowlist; these are client-side demo gates, not production server authorization. Shopping data, orders, and service requests are local to each device/browser. Payment and service workflows are previews, not production integrations.
