# Live integration plan

The local prototype is intentionally usable without provider credentials. Move to live services in this order so the demo does not break while integrations are being added.

1. **Firebase project and auth**: register the Android app and web app; enable email/password; add a sign-in screen; create user profiles with roles assigned only through a trusted admin process. Do not let users grant themselves `admin` by editing client data.
2. **Firestore data model**: `products/{productId}`, `users/{uid}`, `orders/{orderId}`, `dealerApplications/{applicationId}`, `serviceRequests/{requestId}`, and `notifications/{notificationId}`. Add security rules that restrict each user to their own records and permit admin writes only to verified admins. Import catalogue data and migrate local demo data deliberately.
3. **Repository boundary**: isolate reads/writes behind service functions. Keep local demo repository and Firestore repository separate, selected by explicit environment configuration. Add loading/error states and offline retry behavior before switching production users.
4. **Payments (future)**: the current mobile app uses a Razorpay-style visual checkout preview only. It does not connect to a payment provider or charge money. If real payments are needed later, add a trusted backend, server-calculated prices, signed webhooks, and end-to-end payment status handling.
5. **FCM**: request notification permission, save device tokens to the authenticated user's profile, and send notifications from a trusted backend when order/service status changes. Handle token refresh and denied permission.
6. **Address lookup**: use an OpenStreetMap-compatible provider with a usage policy, debouncing, error states, and a manual-address fallback. Do not call public geocoding endpoints on every keystroke.
7. **Email/SMS**: send from a server-side function, protect API keys, avoid exposing customer data in logs, and handle provider errors/rate limits. Obtain consent for SMS.
8. **Admin deployment**: configure environment variables in Vercel, deploy, and verify role restrictions from a non-admin account. A hidden admin page is not access control.
9. **Integration tests**: test account creation/sign-in, customer order, dealer order, unauthorized reads/writes, payment success/failure, notification delivery, service scheduling, and persistence across devices.
10. **Daily Instagram automation**: source lives in `automation/instagram-worker`. It uses Cloudflare Workers AI for captions and images, R2 for public post media, and a daily Worker Cron Trigger. Configure Meta permissions and Cloudflare secrets before activation; check current free-tier limits and verify the first post before claiming the workflow is live.
