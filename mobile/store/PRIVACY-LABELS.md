# App Store privacy nutrition labels

EAS Metadata cannot push these. In App Store Connect → App Privacy, declare the following. Nothing is used to track across apps or websites. Nothing is used for advertising.

Do not enable App Tracking Transparency. The house does not use an advertising identifier.

| Data type | Linked to the user | Tracking | Purposes |
| --- | --- | --- | --- |
| Name | Yes | No | App Functionality |
| Email address | Yes | No | App Functionality |
| Phone number | Yes | No | App Functionality |
| Physical address | Yes | No | App Functionality |
| Product interaction (reservations, bag) | Yes | No | App Functionality |
| Customer support (visit and return letters) | Yes | No | App Functionality |
| User ID (Clerk) | Yes | No | App Functionality |
| Device ID (Expo push token, if Word is allowed) | Yes | No | App Functionality |
| Purchase history (Stripe) | Yes | No | App Functionality |
| Payment info | Yes | No | App Functionality — collected by Stripe on their page, not stored by the house as card numbers |

Third parties whose code is in the binary or the live till: Clerk (account), Stripe (payment), Expo (push and updates). No analytics SDK. No advertising SDK.

Privacy policy: https://www.kiano.london/privacy
