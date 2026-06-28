// Renders a single shape using plain Views only.
// Safe for any shapeType (unknown -> square fallback).

import React from 'react';
import { View } from 'react-native';

import { getShapePieceStyle } from '../data/shapeItems';

export default function ShapePiece({ shapeType, colorKey, size = 80, style, softShadow = false }) {
  const spec = getShapePieceStyle(shapeType, colorKey, size);

  const shadow = softShadow
    ? {
        shadowColor: '#000000',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }
    : null;

  // Triangles are drawn with border tricks; shadows on them look odd, so skip.
  if (spec.kind === 'triangle') {
    return <View style={[spec.style, style]} />;
  }

  return <View style={[spec.style, shadow, style]} />;
}
