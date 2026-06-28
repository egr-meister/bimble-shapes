// Static shape definitions for Bimble Shapes.
// Shapes are drawn with plain React Native Views (no image assets).

import colors from '../theme/colors';

export const SHAPE_TYPES = ['circle', 'square', 'triangle', 'rectangle'];

export const SHAPE_COLORS = [
  'red',
  'blue',
  'yellow',
  'green',
  'orange',
  'purple',
  'pink',
];

const SHAPE_LABELS = {
  circle: 'Circle',
  square: 'Square',
  triangle: 'Triangle',
  rectangle: 'Rectangle',
};

// Friendly emoji symbols (used only as light decoration, never required).
export const SHAPE_EMOJIS = {
  circle: '🔵',
  square: '🟨',
  triangle: '🔺',
  rectangle: '🟫',
};

export function getShapeLabel(shapeType) {
  return SHAPE_LABELS?.[shapeType] ?? 'Shape';
}

export function getShapeColor(colorKey) {
  return colors?.[colorKey] ?? colors?.primary ?? '#6C63FF';
}

// Returns a style object describing how to render a shape with a plain View.
// Always returns a safe style. Unknown shapes fall back to a square.
export function getShapePieceStyle(shapeType, colorKey, size) {
  const s = typeof size === 'number' && size > 0 ? size : 80;
  const fill = getShapeColor(colorKey);

  if (shapeType === 'circle') {
    return {
      kind: 'view',
      style: {
        width: s,
        height: s,
        borderRadius: s / 2,
        backgroundColor: fill,
      },
    };
  }

  if (shapeType === 'rectangle') {
    return {
      kind: 'view',
      style: {
        width: s * 1.5,
        height: s * 0.72,
        borderRadius: 12,
        backgroundColor: fill,
      },
    };
  }

  if (shapeType === 'triangle') {
    // Triangles are drawn with border tricks.
    return {
      kind: 'triangle',
      style: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: s / 2,
        borderRightWidth: s / 2,
        borderBottomWidth: s,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: fill,
      },
    };
  }

  // square (and fallback)
  return {
    kind: 'view',
    style: {
      width: s,
      height: s,
      borderRadius: 14,
      backgroundColor: fill,
    },
  };
}
