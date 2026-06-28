// Free Build canvas: shapes can be dragged freely. No correct/wrong, no saving.
// Positions are kept only for the current screen session.

import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';

import colors from '../theme/colors';
import ShapePiece from './ShapePiece';

function FreeDragShape({ shape }) {
  const pan = useRef(
    new Animated.ValueXY({ x: shape?.startX ?? 0, y: shape?.startY ?? 0 })
  ).current;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Switch to offset-based dragging so movement is smooth.
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const size = shape?.size ?? 70;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.dragItem,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
    >
      <ShapePiece shapeType={shape?.shapeType} colorKey={shape?.colorKey} size={size} softShadow />
    </Animated.View>
  );
}

export default function FreeBuildCanvas({ shapes = [], style }) {
  const safeShapes = Array.isArray(shapes) ? shapes : [];

  return (
    <View style={[styles.canvas, style]}>
      {safeShapes.length === 0 ? (
        <View pointerEvents="none" style={styles.hint}>
          <Text style={styles.hintEmoji}>🧩</Text>
          <Text style={styles.hintText}>Add shapes and drag them around to make your own friend.</Text>
        </View>
      ) : null}

      {safeShapes.map((shape) => (
        <FreeDragShape key={shape.id} shape={shape} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: colors.board,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dragItem: { position: 'absolute', left: 0, top: 0 },
  hint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  hintEmoji: { fontSize: 44, marginBottom: 10 },
  hintText: { fontSize: 16, color: colors.mutedText, textAlign: 'center', lineHeight: 22 },
});
