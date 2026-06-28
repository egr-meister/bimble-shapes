// Renders a small assembled preview of a character from its shape layout.
// Uses plain Views, scaled from the build-board design coordinate space.

import React from 'react';
import { View } from 'react-native';

import {
  getCharacterLayout,
  BUILD_BOARD_WIDTH,
  BUILD_BOARD_HEIGHT,
} from '../data/characterItems';
import { getShapeColor } from '../data/shapeItems';

function PreviewShape({ slot, scale }) {
  const fill = getShapeColor(slot?.colorKey);
  const w = (slot?.width ?? 40) * scale;
  const h = (slot?.height ?? 40) * scale;
  const left = (slot?.x ?? 0) * scale;
  const top = (slot?.y ?? 0) * scale;

  if (slot?.shapeType === 'triangle') {
    return (
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
          borderBottomColor: fill,
        }}
      />
    );
  }

  let borderRadius = 8 * scale;
  if (slot?.shapeType === 'circle') {
    borderRadius = Math.max(w, h) / 2;
  }

  return (
    <View
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        height: h,
        borderRadius,
        backgroundColor: fill,
      }}
    />
  );
}

export default function CharacterPreview({
  characterId,
  difficulty = 'easy',
  width = 140,
  style,
}) {
  const layout = getCharacterLayout(characterId, difficulty) ?? [];
  const scale = width / BUILD_BOARD_WIDTH;
  const height = BUILD_BOARD_HEIGHT * scale;

  return (
    <View style={[{ width, height }, style]}>
      {layout.map((slot) => (
        <PreviewShape key={slot.id} slot={slot} scale={scale} />
      ))}
    </View>
  );
}
