# Implementation Plan - Fix Missing Android Resources

The build is failing because several resources referenced in `AndroidManifest.xml` are missing from the `app` module. Specifically, the app icons (`ic_launcher`, `ic_launcher_round`) and the `file_paths.xml` for the `FileProvider` are not found.

## Proposed Changes

I will create basic versions of these resources to allow the project to build successfully.

### 1. App Icons (Adaptive & Fallback)

I will create a simple adaptive icon using vector drawables. This will cover modern Android versions (API 26+) and provide a fallback for older versions.

- **[NEW] [ic_launcher_background.xml](file:///C:/Users/Vigge/Downloads/dream-interpreter-complete/dream-interpreter/android/app/src/main/res/drawable/ic_launcher_background.xml)**: A solid color background using the project's `colorPrimary`.
- **[NEW] [ic_launcher_foreground.xml](file:///C:/Users/Vigge/Downloads/dream-interpreter-complete/dream-interpreter/android/app/src/main/res/drawable/ic_launcher_foreground.xml)**: A simple vector foreground.
- **[NEW] [ic_launcher.xml](file:///C:/Users/Vigge/Downloads/dream-interpreter-complete/dream-interpreter/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml)**: Adaptive icon definition for API 26+.
- **[NEW] [ic_launcher_round.xml](file:///C:/Users/Vigge/Downloads/dream-interpreter-complete/dream-interpreter/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml)**: Round adaptive icon definition for API 26+.
- **[NEW] [ic_launcher.xml](file:///C:/Users/Vigge/Downloads/dream-interpreter-complete/dream-interpreter/android/app/src/main/res/mipmap/ic_launcher.xml)**: Fallback icon for older APIs.
- **[NEW] [ic_launcher_round.xml](file:///C:/Users/Vigge/Downloads/dream-interpreter-complete/dream-interpreter/android/app/src/main/res/mipmap/ic_launcher_round.xml)**: Fallback round icon for older APIs.

### 2. FileProvider Configuration

- **[NEW] [file_paths.xml](file:///C:/Users/Vigge/Downloads/dream-interpreter-complete/dream-interpreter/android/app/src/main/res/xml/file_paths.xml)**: Define the required file paths for the `FileProvider` to resolve the manifest error.

## Verification Plan

### Automated Tests
- Execute `./gradlew :app:processDebugResources` to confirm that AAPT2 no longer reports missing resources.
- Execute a full build using `./gradlew assembleDebug`.

### Manual Verification
- (Optional) Deploy to a device/emulator to verify the placeholder icon is visible.
