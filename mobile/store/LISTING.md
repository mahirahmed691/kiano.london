# Kiano London — store listing pack

Assets and copy to ship the Expo app (`london.kiano.app`, App Store Connect `6805163116`). Photography and the wordmark are the house’s. Do not invent a second visual system.

## What is in this folder

| File | Use |
| --- | --- |
| `icon-1024.png` | App Store icon. Same mark as `mobile/assets/images/icon.png`. Interlocking KK in ink `#1B1714` on ivory `#F2EBDC`. RGB, no alpha, no rounded mask. Source: `icon-monogram.svg`. |
| `icon-512.png` | Play Store high-res icon (512×512). |
| `promotional/feature-graphic-1024x500.png` | Google Play feature graphic (the store “header”). Also usable as a Connect custom product-page still. |
| `promotional/promotional-1920x1080.png` | 16:9 featuring / social / product-page header. |
| `promotional/search-ads-1200x628.png` | Apple Search Ads landscape. |
| `promotional/product-page-1600x900.png` | Wider product-page still. |
| `screenshots/iphone-6.9/` | Required iPhone 6.9" (1320×2868). |
| `screenshots/iphone-6.3/` | iPhone 6.3" (1206×2622). |
| `screenshots/ipad-13/` | Required iPad 13" (2064×2752); the app sets `supportsTablet`. |

Screenshot order for Connect (all RGB PNG, no alpha):

1. House — this week’s Urban Emirati still
2. Stills
3. The Shop
4. A piece (Cream, with the sewn square)
5. The Scent (coming)
6. The house menu
7. A visit, by appointment

## Copy (also in `../store.config.js`)

- Name: Kiano London
- Subtitle: Urban Emirati garments.
- Promotional text: Urban Emirati garments. Worn with purpose.
- Category: Shopping, secondary Lifestyle
- Privacy: https://www.kiano.london/privacy
- Support: https://www.kiano.london/visit
- Marketing: https://www.kiano.london
- Age: unrestricted web access is **yes** (Bag, Account, and the till are the live house in a WebView)
- App Review: Mahir Ahmed, atelier@kiano.london, +44 7784 452854

## What still needs a person

1. **Expo login.** This environment has no `EXPO_TOKEN`. From a machine signed into Expo as `mahir93`:

   ```bash
   cd mobile
   npx eas-cli whoami
   npx eas-cli build --platform ios --profile production --auto-submit --non-interactive
   ```

   First Apple key, if Connect is not already on the Expo project: `npx eas-cli credentials --platform ios`.

2. **Screenshots.** EAS Metadata does not upload the PNGs. In App Store Connect → the 1.0.0 version → iPhone 6.9" and iPad 13", upload the files in `screenshots/` in the order above. iPhone 6.3" if Connect still asks.

3. **Privacy nutrition labels** in Connect. Copy the table in `PRIVACY-LABELS.md`. The privacy URL is already set. Do not turn on tracking.

4. **Submit for Review** after the production archive is in TestFlight. Auto-submit only lands the binary; it does not press Submit for Review.

5. **Universal links.** In `public/.well-known/apple-app-site-association`, replace `TEAMID` with the Apple Team ID (ten characters, in the Apple Developer membership). Redeploy the site. Associated domains are already in the binary.

6. **Android / FCM.** Before a Play build: add a Firebase Android app for `london.kiano.app`, put `google-services.json` in `mobile/`, set `expo.android.googleServicesFile` to `./google-services.json`, then `npx eas-cli credentials --platform android`. Put the upload-key SHA-256 into `public/.well-known/assetlinks.json`. Then:

   ```bash
   npx eas-cli build --platform android --profile production --auto-submit --non-interactive
   ```

The feature graphic and 1024 icon are ready for Play when that build exists.

## Icon

Apple applies the squircle. Do not round the PNG. Do not add alpha. The binary icon is the same 1024 file at `mobile/assets/images/icon.png`: the interlocking KK, ink on ivory. The Android adaptive foreground is the KK on a transparent field; the adaptive background is ivory.
