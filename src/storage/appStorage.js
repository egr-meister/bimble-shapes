// Local persistence with AsyncStorage.
// - Always returns default data if storage is empty or corrupted.
// - Merges stored data with defaults so missing keys never crash the app.
// - Stores NO personal data. No gambling-style or payment wording anywhere.

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createDefaultStats, mergeStats, recordCompletedCharacter, recordShapeAnswer as recordShapeAnswerStat } from '../utils/statsHelpers';
import { createDefaultProgress, mergeProgress, updateUnlockedStickers } from '../utils/progressHelpers';

const STORAGE_KEY = 'bimble_shapes_app_data_v1';

export function createDefaultSettings() {
  return {
    soundEnabled: true,
    defaultDifficulty: 'easy',
    hintsEnabled: true,
    completionAnimationEnabled: true,
    theme: 'bimbleWorkshop',
  };
}

export function createDefaultData() {
  return {
    stats: createDefaultStats(),
    progress: createDefaultProgress(),
    settings: createDefaultSettings(),
  };
}

function mergeSettings(stored) {
  const base = createDefaultSettings();
  if (!stored || typeof stored !== 'object') {
    return base;
  }
  return {
    soundEnabled: typeof stored.soundEnabled === 'boolean' ? stored.soundEnabled : base.soundEnabled,
    defaultDifficulty: ['easy', 'medium', 'hard'].includes(stored.defaultDifficulty)
      ? stored.defaultDifficulty
      : base.defaultDifficulty,
    hintsEnabled: typeof stored.hintsEnabled === 'boolean' ? stored.hintsEnabled : base.hintsEnabled,
    completionAnimationEnabled:
      typeof stored.completionAnimationEnabled === 'boolean'
        ? stored.completionAnimationEnabled
        : base.completionAnimationEnabled,
    theme: 'bimbleWorkshop',
  };
}

function mergeData(stored) {
  if (!stored || typeof stored !== 'object') {
    return createDefaultData();
  }
  return {
    stats: mergeStats(stored.stats),
    progress: mergeProgress(stored.progress),
    settings: mergeSettings(stored.settings),
  };
}

export async function loadAppData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultData();
    }
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      // Corrupted JSON: fall back to defaults instead of crashing.
      return createDefaultData();
    }
    return mergeData(parsed);
  } catch (e) {
    return createDefaultData();
  }
}

export async function saveAppData(data) {
  try {
    const safe = mergeData(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return safe;
  } catch (e) {
    return mergeData(data);
  }
}

// Records a completed character build, updates stickers, and saves.
// result: { characterId, difficulty, shapesPlaced, completedAt }
export async function recordCharacterResult(result) {
  const data = await loadAppData();
  const stats = recordCompletedCharacter(data.stats, result);
  const progress = updateUnlockedStickers(data.progress, stats);
  const next = { ...data, stats, progress };
  await saveAppData(next);
  return next;
}

export async function recordShapeAnswer(isCorrect) {
  const data = await loadAppData();
  const stats = recordShapeAnswerStat(data.stats, !!isCorrect);
  const progress = updateUnlockedStickers(data.progress, stats);
  const next = { ...data, stats, progress };
  await saveAppData(next);
  return next;
}

export async function resetBimbleStats() {
  const data = await loadAppData();
  const next = { ...data, stats: createDefaultStats() };
  await saveAppData(next);
  return next;
}

export async function resetBimbleProgress() {
  const data = await loadAppData();
  const next = { ...data, progress: createDefaultProgress() };
  await saveAppData(next);
  return next;
}

export async function updateSettings(settings) {
  const data = await loadAppData();
  const next = { ...data, settings: mergeSettings({ ...data.settings, ...settings }) };
  await saveAppData(next);
  return next;
}

// Clears statistics, progress, stickers, and settings, then restores defaults.
export async function clearAllData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore: returning defaults below keeps the app stable.
  }
  const fresh = createDefaultData();
  await saveAppData(fresh);
  return fresh;
}
