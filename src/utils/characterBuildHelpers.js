// Pure helpers for the character building activity.
// No timers, no penalties, no reward mechanics. Predictable and safe.

import { getCharacterLayout, getCharacterPieces, getCharacterItem } from '../data/characterItems';
import { getShapeLabel } from '../data/shapeItems';
import { getNowIso } from './dateUtils';

export const DIFFICULTIES = [
  { id: 'easy', title: 'Easy', description: 'A few big shapes.' },
  { id: 'medium', title: 'Medium', description: 'More shapes to place.' },
  { id: 'hard', title: 'Hard', description: 'A bigger build with one extra shape.' },
];

function safeDifficulty(difficulty) {
  return DIFFICULTIES.some((d) => d.id === difficulty) ? difficulty : 'easy';
}

// Always returns a valid build state, even for unknown input.
export function createCharacterBuildState(characterId, difficulty) {
  const character = getCharacterItem(characterId);
  const diff = safeDifficulty(difficulty);
  const slots = getCharacterLayout(character.id, diff) ?? [];
  const pieces = getCharacterPieces(character.id, diff) ?? [];

  return {
    id: `build_${character.id}_${diff}_${Date.now()}`,
    characterId: character.id,
    difficulty: diff,
    slots,
    pieces,
    placedPieceIds: [],
    attempts: 0,
    mistakes: 0,
    startedAt: getNowIso(),
  };
}

// A piece matches a slot when it points to that slot and is not a distractor.
export function checkPieceMatchesSlot(piece, slot) {
  if (!piece || !slot) {
    return false;
  }
  if (piece.isDistractor) {
    return false;
  }
  return piece.slotId === slot.id;
}

// Records a successful placement. Wrong drops never call this.
export function placePiece(buildState, pieceId, slotId) {
  if (!buildState) {
    return buildState;
  }
  const placed = buildState.placedPieceIds ?? [];
  if (!pieceId || placed.includes(pieceId)) {
    return buildState;
  }
  // Optional safety: only place when the piece truly belongs to this slot.
  const piece = (buildState.pieces ?? []).find((p) => p.id === pieceId);
  if (piece && slotId && piece.slotId !== slotId) {
    return buildState;
  }
  return {
    ...buildState,
    placedPieceIds: [...placed, pieceId],
    attempts: (buildState.attempts ?? 0) + 1,
  };
}

// Records a gentle "try again" without removing anything or punishing.
export function returnPieceToStart(buildState, pieceId) {
  if (!buildState) {
    return buildState;
  }
  return {
    ...buildState,
    attempts: (buildState.attempts ?? 0) + 1,
    mistakes: (buildState.mistakes ?? 0) + 1,
  };
}

export function getRequiredPieceCount(buildState) {
  const pieces = buildState?.pieces ?? [];
  return pieces.filter((p) => !p.isDistractor).length;
}

export function getPlacedPieceCount(buildState) {
  const placed = buildState?.placedPieceIds ?? [];
  const pieces = buildState?.pieces ?? [];
  return placed.filter((id) => {
    const piece = pieces.find((p) => p.id === id);
    return piece && !piece.isDistractor;
  }).length;
}

export function isCharacterComplete(buildState) {
  const required = getRequiredPieceCount(buildState);
  if (required <= 0) {
    return false;
  }
  return getPlacedPieceCount(buildState) >= required;
}

// Gentle, non-punishing hint text.
export function getHintForPiece(piece, slot) {
  const shapeName = getShapeLabel(piece?.shapeType).toLowerCase();
  if (piece?.isDistractor) {
    return 'This shape fits somewhere else. Try another piece.';
  }
  if (slot?.label) {
    return `Look for the ${slot.label.toLowerCase()} spot for the ${shapeName}.`;
  }
  return `Good try. Find the matching ${shapeName} spot.`;
}
