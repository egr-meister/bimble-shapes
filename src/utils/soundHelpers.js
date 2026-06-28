// Gentle success "sound" helpers.
// This build keeps things lightweight and dependency-free: no heavy audio
// libraries, no microphone, no permissions. If sound is enabled we simply
// no-op safely so visual feedback always remains the primary feedback.
//
// These functions never throw. Visual feedback in the screens works regardless.

function isSoundEnabled(settings) {
  return settings?.soundEnabled ?? true;
}

export function playCorrectSoundIfEnabled(settings) {
  try {
    if (!isSoundEnabled(settings)) {
      return;
    }
    // Intentionally no audio playback in this offline, permission-free build.
    // Reserved for a future lightweight bundled sound. Visual feedback covers it.
  } catch (e) {
    // Never let sound break the activity.
  }
}

export function playCompletionSoundIfEnabled(settings) {
  try {
    if (!isSoundEnabled(settings)) {
      return;
    }
    // See note above.
  } catch (e) {
    // Never let sound break the activity.
  }
}
