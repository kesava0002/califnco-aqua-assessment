# Task 1 — QA checklist

Use a real Android phone if possible. Mark each item only after manually testing it.

## Android app

- [ ] App launches and the Home screen renders without a red error screen.
- [ ] All six category filters open the correct catalogue subset.
- [ ] Search matches product names and category names; empty search results are handled.
- [ ] Product detail opens and back navigation returns to the catalogue.
- [ ] Add-to-cart button adds an item without also opening its detail page.
- [ ] Cart increments/decrements quantities and removes a line when quantity reaches zero.
- [ ] Empty cart cannot be checked out.
- [ ] Empty delivery address is rejected.
- [ ] Checkout opens the Razorpay-style demo preview, shows payment method choices, and clearly says no payment is taken.
- [ ] Demo order creates a unique order ID, empties the cart, and appears in order history.
- [ ] App restart preserves cart/profile/orders/services.
- [ ] Dealer mode changes displayed prices, starts each added product at 5 units, prevents reducing a dealer line below 5, and permits removing it.
- [ ] Service type can be selected; blank address is rejected; saved request appears in service history.
- [ ] Profile fields can be edited and survive an app restart.
- [ ] Test on a smaller screen and confirm buttons/labels remain usable.

## Admin website

- [ ] `npm run build` completes without errors.
- [ ] Overview values match visible demo records and are clearly identified as demo data.
- [ ] Search matches order ID, customer, and email.
- [ ] Status filter works; status updates persist after refresh.
- [ ] Dealer approve/reject actions update the displayed status and persist after refresh.
- [ ] Service schedule/close actions update status and persist after refresh.
- [ ] CSV export downloads a readable file with the expected columns.
- [ ] Sidebar works on desktop and mobile; tables can scroll horizontally on narrow screens.
- [ ] Deployed Vercel URL opens in a private/incognito browser and mobile width.

## Submission honesty

- [ ] Explain that checkout is a UI demo only; it is not connected to Razorpay and does not collect money.
- [ ] Do not claim Firebase, FCM, Razorpay live payments, maps, or email/SMS are live unless each is configured and end-to-end tested.
- [ ] Replace placeholder/category-level product images with licensed images that match the product names before final evaluation.
- [ ] Set any shared Drive/repository/deployment links to the access level required by the recruiter.
