// The central build board. Presentational: it draws the board, the slot
// targets, and the placed shapes. It reports its on-screen position so the
// parent screen can hit-test drops. It never crashes if not yet measured.

import React, { useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import colors from '../theme/colors';
import ShapeSlot from './ShapeSlot';
import { BUILD_BOARD_WIDTH, BUILD_BOARD_HEIGHT } from '../data/characterItems';

export default function BuildBoard({
  slots = [],
  pieces = [],
  placedPieceIds = [],
  highlightedSlotId = null,
  boardWidth = 300,
  onBoardMeasured,
  style,
}) {
  const ref = useRef(null);
  const scale = (boardWidth > 0 ? boardWidth : 300) / BUILD_BOARD_WIDTH;
  const boardHeight = BUILD_BOARD_HEIGHT * scale;

  const handleLayout = useCallback(() => {
    const node = ref.current;
    if (node && typeof node.measureInWindow === 'function') {
      // measureInWindow gives window coordinates that match PanResponder moveX/moveY.
      node.measureInWindow((x, y, width, height) => {
        if (typeof onBoardMeasured === 'function') {
          onBoardMeasured({ pageX: x, pageY: y, scale, width, height });
        }
      });
    }
  }, [onBoardMeasured, scale]);

  const safeSlots = Array.isArray(slots) ? slots : [];
  const safePieces = Array.isArray(pieces) ? pieces : [];
  const placed = Array.isArray(placedPieceIds) ? placedPieceIds : [];

  const placedSlotIds = safePieces
    .filter((p) => placed.includes(p.id) && !p.isDistractor)
    .map((p) => p.slotId);

  return (
    <View
      ref={ref}
      onLayout={handleLayout}
      style={[styles.board, { width: boardWidth, height: boardHeight }, style]}
    >
      {safeSlots.map((slot) => (
        <ShapeSlot
          key={slot.id}
          slot={slot}
          scale={scale}
          placed={placedSlotIds.includes(slot.id)}
          highlighted={!placedSlotIds.includes(slot.id) && slot.id === highlightedSlotId}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: colors.board,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.border,
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
