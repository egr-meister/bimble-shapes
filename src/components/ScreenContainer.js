// Page wrapper: safe-area aware background with optional floating shape decor.
// Keeps content clear of notches, cutouts, and rounded corners.

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../theme/colors';
import ShapePiece from './ShapePiece';

function Decor() {
  // Faint floating shapes in the background corners.
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.blob, { top: 24, left: -10, opacity: 0.18 }]}>
        <ShapePiece shapeType="circle" colorKey="blue" size={90} />
      </View>
      <View style={[styles.blob, { top: 90, right: -16, opacity: 0.16 }]}>
        <ShapePiece shapeType="square" colorKey="green" size={70} />
      </View>
      <View style={[styles.blob, { bottom: 120, left: -18, opacity: 0.15 }]}>
        <ShapePiece shapeType="triangle" colorKey="orange" size={90} />
      </View>
      <View style={[styles.blob, { bottom: 40, right: -10, opacity: 0.16 }]}>
        <ShapePiece shapeType="rectangle" colorKey="pink" size={80} />
      </View>
    </View>
  );
}

export default function ScreenContainer({
  children,
  scroll = false,
  decor = true,
  background = colors.background,
  contentStyle,
}) {
  const insets = useSafeAreaInsets();

  const padding = {
    paddingTop: (insets?.top ?? 0) + 12,
    paddingBottom: (insets?.bottom ?? 0) + 16,
    paddingLeft: (insets?.left ?? 0) + 18,
    paddingRight: (insets?.right ?? 0) + 18,
  };

  return (
    <View style={[styles.root, { backgroundColor: background ?? colors.background }]}>
      {decor ? <Decor /> : null}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, padding, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, padding, contentStyle]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  blob: { position: 'absolute' },
});
