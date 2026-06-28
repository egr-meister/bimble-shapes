#!/usr/bin/env node
/*
 * Configures release signing in the generated Android project.
 * Run AFTER `npx expo prebuild --platform android`.
 *
 * Adds a `release` signingConfig that reads credentials from environment
 * variables (provided by GitHub Secrets in CI) and points the release
 * buildType at it. The keystore file must already exist at
 * android/app/release.keystore.
 *
 * Idempotent: running it twice is safe.
 */
const fs = require('fs');
const path = require('path');

const gradlePath = path.join(process.cwd(), 'android', 'app', 'build.gradle');

if (!fs.existsSync(gradlePath)) {
  console.error('Could not find android/app/build.gradle. Run `expo prebuild` first.');
  process.exit(1);
}

let gradle = fs.readFileSync(gradlePath, 'utf8');

if (gradle.includes('// bimble-release-signing')) {
  console.log('Release signing already configured. Skipping.');
  process.exit(0);
}

// 1) Add a `release` signingConfig inside the existing signingConfigs { } block.
const releaseSigningBlock = [
  '',
  '        // bimble-release-signing',
  '        release {',
  "            storeFile file('release.keystore')",
  '            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")',
  '            keyAlias System.getenv("ANDROID_KEY_ALIAS")',
  '            keyPassword System.getenv("ANDROID_KEY_PASSWORD")',
  '        }',
].join('\n');

if (!/signingConfigs\s*\{/.test(gradle)) {
  console.error('Could not find a signingConfigs block in build.gradle.');
  process.exit(1);
}
gradle = gradle.replace(/signingConfigs\s*\{/, (m) => `${m}${releaseSigningBlock}`);

// 2) Point the release buildType at signingConfigs.release (not debug).
const before = gradle;
gradle = gradle.replace(
  /(release\s*\{[^}]*?signingConfig\s+signingConfigs\.)debug/,
  '$1release'
);
if (gradle === before) {
  console.warn('Warning: could not switch release buildType signingConfig automatically.');
  console.warn('Verify android/app/build.gradle uses signingConfigs.release for release builds.');
}

fs.writeFileSync(gradlePath, gradle, 'utf8');
console.log('Release signing configured in android/app/build.gradle.');
