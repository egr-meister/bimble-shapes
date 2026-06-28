// Local sticker progress helpers.
// Stickers are simple learning markers only. They have no monetary value.

import { getUnlockedStickers } from '../data/stickerItems';

export function createDefaultProgress() {
  return {
    unlockedStickerIds: [],
  };
}

export function mergeProgress(stored) {
  const base = createDefaultProgress();
  if (!stored || typeof stored !== 'object') {
    return base;
  }
  const ids = Array.isArray(stored.unlockedStickerIds) ? stored.unlockedStickerIds : [];
  // Keep only unique string ids.
  const unique = [];
  ids.forEach((id) => {
    if (typeof id === 'string' && !unique.includes(id)) {
      unique.push(id);
    }
  });
  return { ...base, unlockedStickerIds: unique };
}

// Recomputes unlocked stickers from stats and merges with existing progress.
export function updateUnlockedStickers(progress, stats) {
  const base = mergeProgress(progress);
  const earned = getUnlockedStickers(stats);
  const merged = [...base.unlockedStickerIds];
  earned.forEach((id) => {
    if (!merged.includes(id)) {
      merged.push(id);
    }
  });
  return { ...base, unlockedStickerIds: merged };
}

export function getStickerIds(progress) {
  return mergeProgress(progress).unlockedStickerIds;
}

export function resetProgress() {
  return createDefaultProgress();
}
