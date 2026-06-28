// A single target slot on the build board.
// Empty slots show a soft colored "ghost" of the shape so the target is
// always clearly visible (even over an already-placed piece). When the
// matching piece is placed, the slot shows the full-color shape.

import React from 'react';
import { View } from 'react-native';

import colors from '../theme/colors';
import { getShapeColor } from '../data/shapeItems';

// Convert a #RRGGBB hex into an rgba() string with the given alpha.
function tint(hex, alpha) {
  if (typeof hex !== 'string' || hex[0] !== '#' || hex.length < 7) {
    return `rgba(120,135,148,${alpha})`;
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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

  // The highlight halo behind the slot (rounded soft box) when active.
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
        opacity: 0.95,
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
            // Empty: faded colored ghost. Placed: full color.
            borderBottomColor: placed ? fill : tint(fill, 0.4),
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
          // Empty: faint colored tint so the target is visible.
          backgroundColor: placed ? fill : tint(fill, 0.18),
          borderWidth: placed ? 0 : 3,
          borderColor: placed ? 'transparent' : fill,
          borderStyle: 'dashed',
        }}
      />
    </View>
  );
}
