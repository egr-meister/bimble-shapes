// Local statistics helpers. Never returns NaN. Always merges with defaults.

const CHARACTER_IDS = ['cat', 'robot', 'bird', 'monster', 'car'];
const DIFFICULTY_IDS = ['easy', 'medium', 'hard'];

export function createDefaultStats() {
  const byCharacter = {};
  CHARACTER_IDS.forEach((id) => {
    byCharacter[id] = { completed: 0 };
  });
  const byDifficulty = {};
  DIFFICULTY_IDS.forEach((id) => {
    byDifficulty[id] = { completed: 0 };
  });
  return {
    completedCharacters: 0,
    shapesPlaced: 0,
    findShapeCorrect: 0,
    findShapeIncorrect: 0,
    byCharacter,
    byDifficulty,
  };
}

// Deep-merges stored stats onto defaults so missing keys never crash.
export function mergeStats(stored) {
  const base = createDefaultStats();
  if (!stored || typeof stored !== 'object') {
    return base;
  }
  const merged = {
    ...base,
    completedCharacters: numberOr(stored.completedCharacters, 0),
    shapesPlaced: numberOr(stored.shapesPlaced, 0),
    findShapeCorrect: numberOr(stored.findShapeCorrect, 0),
    findShapeIncorrect: numberOr(stored.findShapeIncorrect, 0),
  };
  merged.byCharacter = { ...base.byCharacter };
  CHARACTER_IDS.forEach((id) => {
    merged.byCharacter[id] = {
      completed: numberOr(stored?.byCharacter?.[id]?.completed, 0),
    };
  });
  merged.byDifficulty = { ...base.byDifficulty };
  DIFFICULTY_IDS.forEach((id) => {
    merged.byDifficulty[id] = {
      completed: numberOr(stored?.byDifficulty?.[id]?.completed, 0),
    };
  });
  return merged;
}

function numberOr(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

// Records a completed character build.
export function recordCompletedCharacter(stats, result) {
  const base = mergeStats(stats);
  const characterId = result?.characterId;
  const difficulty = result?.difficulty;
  const shapesPlaced = numberOr(result?.shapesPlaced, 0);

  const next = {
    ...base,
    completedCharacters: base.completedCharacters + 1,
    shapesPlaced: base.shapesPlaced + shapesPlaced,
    byCharacter: { ...base.byCharacter },
    byDifficulty: { ...base.byDifficulty },
  };

  if (characterId && next.byCharacter[characterId]) {
    next.byCharacter[characterId] = {
      completed: next.byCharacter[characterId].completed + 1,
    };
  }
  if (difficulty && next.byDifficulty[difficulty]) {
    next.byDifficulty[difficulty] = {
      completed: next.byDifficulty[difficulty].completed + 1,
    };
  }
  return next;
}

export function recordShapeAnswer(stats, isCorrect) {
  const base = mergeStats(stats);
  if (isCorrect) {
    return { ...base, findShapeCorrect: base.findShapeCorrect + 1 };
  }
  return { ...base, findShapeIncorrect: base.findShapeIncorrect + 1 };
}

export function getTotalCompletedCharacters(stats) {
  return mergeStats(stats).completedCharacters;
}

export function getTotalShapesPlaced(stats) {
  return mergeStats(stats).shapesPlaced;
}

export function resetStats() {
  return createDefaultStats();
}
