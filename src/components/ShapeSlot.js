// A single target slot on the build board.
// Shows a soft "ghost" target when empty, a glow when highlighted,
// and the full-color shape once the matching piece is placed.

import React from 'react';
import { View } from 'react-native';

import colors from '../theme/colors';
import { getShapeColor } from '../data/shapeItems';

export default function ShapeSlot({ slot, scale = 1, placed = false, highlighted = false }) {
  const fill = getShapeColor(slot?.colorKey);
  const w = (slot?.width ?? 40) * scale;
  const h = (slot?.height ?? 40) * scale;
  const left = (slot?.x ?? 0) * scale;
  const top = (slot?.y ?? 0) * scale;

  const isTriangle = slot?.shapeType === 'triangle';
  let borderRadius = 10 * scale;
  if (slot?.shapeType === 'circle') {
    borderRadius = Math.max(w, h) / 2;
  }

  // The highlight halo behind the slot (rounded soft box).
  const halo = highlighted ? (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: left - 8,
        top: top - 8,
        width: w + 16,
        height: h + 16,
        borderRadius: 18,
        backgroundColor: colors.highlight,
        borderWidth: 3,
        borderColor: colors.outline,
        opacity: 0.9,
      }}
    />
  ) : null;

  if (isTriangle) {
    return (
      <View pointerEvents="none">
        {halo}
        <View
          style={{
            position: 'absolute',
            left,
            top,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderLeftWidth: w / 2,
            borderRightWidth: w / 2,
            borderBottomWidth: h,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: placed ? fill : 'rgba(120,135,148,0.25)',
          }}
        />
      </View>
    );
  }

  return (
    <View pointerEvents="none">
      {halo}
      <View
        style={{
          position: 'absolute',
          left,
          top,
          width: w,
          height: h,
          borderRadius,
          backgroundColor: placed ? fill : 'transparent',
          borderWidth: placed ? 0 : 2,
          borderColor: 'rgba(120,135,148,0.35)',
          borderStyle: placed ? 'solid' : 'dashed',
        }}
      />
    </View>
  );
}
