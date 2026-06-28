// Helpers for the "Find the Shape" activity.
// No timers, no penalties. Always returns safe, valid data.

import { SHAPE_TYPES, getShapeLabel } from '../data/shapeItems';

const PROMPTS = {
  circle: 'Find the circle.',
  square: 'Find the square.',
  triangle: 'Find the triangle.',
  rectangle: 'Find the rectangle.',
};

export function getChoiceCountForDifficulty(difficulty) {
  if (difficulty === 'medium') {
    return 3;
  }
  if (difficulty === 'hard') {
    return 4;
  }
  return 2; // easy / fallback
}

// Fisher-Yates shuffle on a copy. Returns a new array.
export function shuffleArray(items) {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function isCorrectAnswer(selectedShapeType, correctShapeType) {
  if (!selectedShapeType || !correctShapeType) {
    return false;
  }
  return selectedShapeType === correctShapeType;
}

// Builds a single find-shape question with unique, non-duplicate choices.
export function buildFindShapeQuestion(difficulty) {
  const choiceCount = Math.min(getChoiceCountForDifficulty(difficulty), SHAPE_TYPES.length);

  const correctShapeType = shuffleArray(SHAPE_TYPES)[0] ?? 'circle';

  // Distinct distractors that are not the correct answer.
  const distractors = shuffleArray(SHAPE_TYPES.filter((t) => t !== correctShapeType));
  const chosen = [correctShapeType, ...distractors.slice(0, Math.max(0, choiceCount - 1))];

  // Final shuffle so the correct answer is not always first.
  const finalTypes = shuffleArray(chosen);

  const choices = finalTypes.map((shapeType) => ({
    id: `choice_${shapeType}`,
    shapeType,
    label: getShapeLabel(shapeType),
  }));

  return {
    id: `shape_question_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    difficulty: difficulty === 'medium' || difficulty === 'hard' ? difficulty : 'easy',
    prompt: PROMPTS?.[correctShapeType] ?? `Find the ${getShapeLabel(correctShapeType).toLowerCase()}.`,
    correctShapeType,
    choices,
  };
}
