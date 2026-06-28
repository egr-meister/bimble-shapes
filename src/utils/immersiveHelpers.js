// Safe wrappers for fullscreen immersive behavior and keep-awake.
// Everything is guarded so a missing API never crashes the app.
//
// Global system-bar hiding is handled by rendering <SystemBars hidden />
// from react-native-edge-to-edge in App.js. These helpers provide a safe
// imperative fallback and manage keep-awake only on build/game screens.

import * as KeepAwake from 'expo-keep-awake';

const GAME_KEEP_AWAKE_TAG = 'bimble-build-screen';

// Best-effort sticky immersive request. Never throws.
export function enableStickyImmersiveMode() {
  try {
    // react-native-edge-to-edge primarily uses the <SystemBars> component.
    // If an imperative API is available in the installed version, use it.
    const edge = require('react-native-edge-to-edge');
    const SystemBars = edge?.SystemBars;
    if (SystemBars && typeof SystemBars.setHidden === 'function') {
      SystemBars.setHidden(true);
    }
  } catch (e) {
    // No-op: the component-based <SystemBars hidden /> still applies.
  }
}

export function activateGameKeepAwake() {
  try {
    if (typeof KeepAwake.activateKeepAwakeAsync === 'function') {
      // Returns a promise; we don't need to await it.
      KeepAwake.activateKeepAwakeAsync(GAME_KEEP_AWAKE_TAG);
    } else if (typeof KeepAwake.activateKeepAwake === 'function') {
      KeepAwake.activateKeepAwake(GAME_KEEP_AWAKE_TAG);
    }
  } catch (e) {
    // Ignore: keep-awake is a nicety, not required for correctness.
  }
}

export function deactivateGameKeepAwake() {
  try {
    if (typeof KeepAwake.deactivateKeepAwake === 'function') {
      KeepAwake.deactivateKeepAwake(GAME_KEEP_AWAKE_TAG);
    }
  } catch (e) {
    // Ignore.
  }
}

// Convenience alias used when leaving a static screen, just to be safe.
export function disableKeepAwakeSafely() {
  deactivateGameKeepAwake();
}
