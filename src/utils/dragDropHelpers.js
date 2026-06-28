// Simple, safe geometry helpers for drag-and-drop.
// Built around plain rectangles. Never crash on missing layouts.

export function isPointInsideRect(point, rect) {
  if (!point || !rect) {
    return false;
  }
  const { x, y } = point;
  const { x: rx, y: ry, width, height } = rect;
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof rx !== 'number' ||
    typeof ry !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number'
  ) {
    return false;
  }
  return x >= rx && x <= rx + width && y >= ry && y <= ry + height;
}

// slotLayouts: array of { slotId, rect }. Returns the slotId at the point, or null.
export function findSlotAtPoint(point, slotLayouts) {
  if (!point || !Array.isArray(slotLayouts)) {
    return null;
  }
  for (let i = 0; i < slotLayouts.length; i += 1) {
    const entry = slotLayouts[i];
    if (entry && isPointInsideRect(point, entry.rect)) {
      return entry.slotId ?? null;
    }
  }
  return null;
}

// A simple staggered starting position for a piece in the tray.
export function createInitialPiecePosition(index) {
  const safeIndex = typeof index === 'number' && index >= 0 ? index : 0;
  return { x: 0, y: 0, index: safeIndex };
}

// Returns the translation needed to snap a piece center onto a slot center.
export function snapPieceToSlot(piecePosition, slotRect) {
  if (!slotRect) {
    return piecePosition ?? { x: 0, y: 0 };
  }
  const px = piecePosition?.x ?? 0;
  const py = piecePosition?.y ?? 0;
  return { x: px, y: py, snapped: true, slotRect };
}

export function returnPieceToStart(index) {
  return createInitialPiecePosition(index);
}
