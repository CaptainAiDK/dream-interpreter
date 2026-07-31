# Android wrapper

This project now includes a Capacitor-based Android wrapper.

## Commands

1. Install dependencies:
   pnpm install

2. Build the web app:
   pnpm build

3. Sync the Android project:
   pnpm android:sync

4. Open Android Studio:
   pnpm android:open

## Notes

- The Android app uses the web build from `dist/public`.
- The existing Express backend remains the server side of the app.
- For production, you should point the app to a publicly reachable backend URL and configure OAuth redirect handling for Android.
