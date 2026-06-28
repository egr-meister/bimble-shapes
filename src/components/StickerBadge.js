// A rounded sticker badge. Locked badges look soft and grey, never punishing.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from '../theme/colors';

export default function StickerBadge({ sticker, unlocked = false, style }) {
  const title = sticker?.title ?? 'Sticker';
  const emoji = sticker?.emoji ?? '⭐';
  const requirement = sticker?.requirementText ?? '';

  return (
    <View style={[styles.badge, unlocked ? styles.unlocked : styles.locked, style]}>
      <View style={[styles.circle, unlocked ? styles.circleOn : styles.circleOff]}>
        <Text style={[styles.emoji, !unlocked && styles.dim]}>{unlocked ? emoji : '🔒'}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.req} numberOfLines={2}>
        {unlocked ? 'Unlocked!' : requirement}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 14,
    alignItems: 'center',
    borderWidth: 3,
    minHeight: 160,
    justifyContent: 'center',
  },
  unlocked: { borderColor: colors.accent, backgroundColor: '#FFFBF0' },
  locked: { borderColor: colors.border },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  circleOn: { backgroundColor: colors.highlight },
  circleOff: { backgroundColor: '#EEF1F5' },
  emoji: { fontSize: 30 },
  dim: { opacity: 0.7 },
  title: { fontSize: 15, fontWeight: '800', color: colors.text, textAlign: 'center' },
  req: { fontSize: 12, color: colors.mutedText, textAlign: 'center', marginTop: 4 },
});
