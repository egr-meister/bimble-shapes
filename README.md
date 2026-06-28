# Bimble Shapes

A calm, offline shape-building app for children. Kids assemble funny characters
from simple geometric shapes (circle, square, triangle, rectangle) by dragging
pieces into the right places. Built with React Native + Expo.

> Bimble Shapes is a calm offline shape-building app for children. It does not
> use ads, purchases, accounts, internet access, social sharing, or personal
> data collection.

## Features

- Build 5 funny characters: Cat, Robot, Bird, Little Monster, and Car.
- Three calm difficulty levels: Easy (3 shapes), Medium (4–5 shapes), Hard (6–7 shapes with one extra piece).
- Simple, reliable drag-and-drop using React Native `PanResponder` and `Animated`.
- "Find the Shape" matching activity (2–4 choices by difficulty).
- Free Build mode for open creative play.
- Local stickers, badges, and progress statistics.
- Parent settings for sound, default difficulty, hints, and completion animation.
- Bright, playful "Bimble Workshop" visual style drawn entirely with plain Views.

## Child Safety

There are no ads, in-app purchases, accounts, analytics, Firebase, external
APIs, internet access, social sharing, leaderboards, chat, loot mechanics, or
real-money rewards. The app never asks for camera, microphone, location,
contacts, calendar, notifications, photo gallery, storage, or file access.

Stickers, badges, and stars are simple **local learning markers** only. They
have **no monetary value**.

## Shape Building Rules

1. Choose a character, then a difficulty.
2. The build board shows the character outline with target slots.
3. Drag each shape piece onto its matching slot.
4. If the shape matches, it snaps into place and the slot fills in.
5. If it does not match, the shape gently returns to its spot and a calm hint
   appears — there is no penalty.
6. When all required shapes are placed, the character is complete and a soft
   completion animation plays. Progress is saved locally and stickers unlock.

Difficulty differences: Easy uses a few big slots with strong highlights and no
distractor shapes. Medium adds more slots and one mild distractor. Hard uses
more, smaller slots and one distractor — still friendly, never frustrating.

## Free Build Mode

Free Build is open creative play: tap "Add Circle / Square / Triangle /
Rectangle" to drop shapes onto a large canvas, then drag them around freely.
There is no scoring, no failure, and no required result. Positions are kept only
for the current screen session — nothing is saved, shared, or exported.

## Drag-and-Drop Implementation

Drag-and-drop is intentionally simple and stable for reliable Android release
builds. Each draggable piece uses `PanResponder` + `Animated.ValueXY`. On
release, the drop point (window coordinates from the gesture) is tested against
the build board's measured slot rectangles (`utils/dragDropHelpers.js`). Drop
zones are padded so they are forgiving for small hands. If the board has not
been measured yet, drops simply return to start instead of crashing.

## No Timer / No Pressure

There are no timers, countdowns, penalties, competitive rankings, or
leaderboards anywhere in the app. Wrong attempts are never punished.

## Offline, No Internet, No Permissions

The app works fully offline and in airplane mode. It does not request the
`INTERNET` permission or any runtime permissions. All data stays on the device
via `AsyncStorage` (settings, progress, stickers, statistics). Common sensitive
permissions are explicitly listed under `android.blockedPermissions` in
`app.json`.

## Screen, Orientation & Display

- Orientation is locked to **portrait** (`app.json` `orientation: "portrait"`).
- Fullscreen **sticky immersive** mode hides the status and navigation bars via
  `SystemBars` from `react-native-edge-to-edge` (rendered with `hidden` in
  `App.js`). Bars reappear temporarily after an edge swipe.
- **Safe area** handling (`react-native-safe-area-context`) keeps content clear
  of notches, camera cutouts, and rounded corners.
- **Keep awake** (`expo-keep-awake`) is active **only** on the Character Build
  and Free Build screens, and is released when leaving them. It is never enabled
  globally or on static screens.

## Stickers & Progress

Six local stickers: a builder sticker for each character (earned by completing
that character once) plus the "Bimble Shape Star" for placing 30 shapes in
total. The Stickers & Progress screen shows completed characters, shapes placed,
find-shape results, completed characters by type, and unlocked stickers.
Progress can be reset, and all local data can be cleared from Parent Settings.

## App Icon & Splash Screen

Custom assets follow the "Bimble Workshop" concept — they are not the default
Expo placeholders.

- **Icon** (`assets/icon.png`, `assets/adaptive-icon.png`): a funny square robot
  face built from simple shapes — circle eyes, a triangle party-hat antenna, a
  rectangle smile, and colorful shape pieces around it, on a warm cream
  background.
- **Splash** (`assets/splash.png`): a soft pastel workshop scene with a
  partially-assembled shape character, floating circle/square/triangle/rectangle
  pieces, decorative dots, the title "Bimble Shapes", and the subtitle
  "Build funny shape friends".

## Bimble Workshop Visual Style

A cozy creative room feel: bright pastel backgrounds, rounded white panels, soft
borders and light shadows, oversized friendly buttons, and playful shape
decorations. All shapes and characters are drawn with plain React Native Views —
no heavy image assets, no SVG libraries, no dark or scary visuals.

## Project Structure

```
App.js, app.json, package.json, package-lock.json, babel.config.js
assets/            icon.png, adaptive-icon.png, splash.png
src/navigation/    AppNavigator.js
src/screens/       8 screens
src/components/     reusable UI components
src/data/          characterItems, shapeItems, stickerItems
src/utils/         build, shape-game, drag-drop, stats, progress, sound, animation, immersive, date helpers
src/storage/       appStorage.js (AsyncStorage)
src/theme/         colors.js
proguard-rules.pro, scripts/configure-signing.js
.github/workflows/ android-build.yml
```

## Getting Started

This project follows the official Expo template conventions. To scaffold an
equivalent project from scratch you would run `npx create-expo-app` and add the
dependencies with `npx expo install`. To run this project:

```bash
npm install
npx expo install --fix
npx expo-doctor
npx expo install --check
npx expo start
```

To run on a connected Android device or emulator (development):

```bash
npx expo run:android
```

### Dependencies

Install only with `npx expo install <package>` so versions stay aligned with the
Expo SDK. Every imported package is a direct dependency in `package.json`,
including the core Expo modules required directly: `expo-asset`,
`expo-constants`, `expo-font`, `expo-modules-core`, and `expo-keep-awake`.

## Building for Android

The app targets **Android API 35** (compileSdk 35, targetSdk 35, minSdk 24) via
the `expo-build-properties` plugin in `app.json`, and is built with the New
Architecture enabled so the release AAB supports Android 15+ **16 KB memory page
sizes**.

Local release build:

```bash
npm install
npx expo install --fix
npx expo prebuild --platform android --no-install
# place release.keystore in android/app and run the signing helper:
node ./scripts/configure-signing.js
cd android
./gradlew assembleRelease   # APK
./gradlew bundleRelease     # AAB
```

### Generate a release keystore (PKCS12)

Use the **same password** for the keystore and the key — different passwords can
break PKCS12 signing.

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore bimble-shapes-release-key.p12 \
  -alias bimble_shapes_key \
  -keyalg RSA -keysize 2048 -validity 10000
```

Convert it to base64 for GitHub Secrets:

```bash
base64 -i bimble-shapes-release-key.p12 -o keystore.base64.txt   # macOS
# or: base64 -w0 bimble-shapes-release-key.p12 > keystore.base64.txt  # Linux
```

### Add GitHub Secrets

In your repository: **Settings → Secrets and variables → Actions → New
repository secret**. Add:

- `ANDROID_KEYSTORE_BASE64` — the base64 string from above
- `ANDROID_KEYSTORE_PASSWORD` — keystore password
- `ANDROID_KEY_ALIAS` — `bimble_shapes_key`
- `ANDROID_KEY_PASSWORD` — same as the keystore password

Never commit the keystore or passwords; `*.p12`/`*.keystore` are gitignored.

### GitHub Actions

`.github/workflows/android-build.yml` runs on push to `main`. It installs
Node.js, runs `npm install`, `npx expo install --fix`, `npx expo-doctor`, and
`npx expo install --check`, installs **Android SDK Platform 35** and **Build
Tools 35.0.0** (`sdkmanager "platforms;android-35" "build-tools;35.0.0"`),
prebuilds the Android project, decodes the keystore from secrets, configures
release signing, then builds and uploads:

- `bimble-shapes-release.apk`
- `bimble-shapes-release.aab`

An emulator launch smoke-test is intentionally **not** part of CI; launch
verification is a local pre-release step (below).

## Google Play Compatibility

- Targets API level **35** (not 34) — avoids the "must target at least API
  level 35" rejection.
- New Architecture enabled so the release AAB supports **16 KB memory page
  sizes** — avoids the "does not support 16 KB memory page sizes" rejection.
- No Firebase, ads, analytics, payment, or external native SDKs.

## Release Optimization (staged)

Build and verify a **non-minified** release first (the default here). Once it
launches successfully, enable standard R8/ProGuard minification and resource
shrinking by adding to the `expo-build-properties` android block in `app.json`:

```json
"enableProguardInReleaseBuilds": true,
"enableShrinkResourcesInReleaseBuilds": true
```

Use the keep rules in `proguard-rules.pro` (copy them into
`android/app/proguard-rules.pro` after prebuild, or paste into the
`extraProguardRules` field). Re-test the app launch after enabling minify and
resource shrinking. Obfuscation here is standard release optimization only.

## Local Launch Verification Checklist

A successful CI build is not proof the app launches. Before release:

1. Build the release APK.
2. Install it on a physical device or emulator: `adb install -r bimble-shapes-release.apk`.
3. Launch the app and capture logs: `adb logcat`.
4. Confirm there are no errors such as "Cannot find native module",
   "Module has not been registered", "Invariant Violation", or
   "theme.fonts.regular is undefined".
5. Confirm portrait lock, fullscreen immersive bars, working drag-and-drop, and
   that the app runs in airplane mode with no permission prompts.

## Privacy

Bimble Shapes does not collect, store, or share personal information. The app
works offline without internet access. Character progress, stickers, statistics,
and settings are stored only on the device.
