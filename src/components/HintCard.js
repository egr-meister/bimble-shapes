// A gentle hint / feedback panel. Calm colors, never alarming.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from '../theme/colors';

const TONES = {
  info: { bg: '#EEF1FF', fg: colors.text, emoji: '💡' },
  success: { bg: '#E7F7EE', fg: colors.success, emoji: '🎉' },
  gentle: { bg: '#FFF3DD', fg: colors.text, emoji: '🙂' },
};

export default function HintCard({ text, tone = 'info', style }) {
  const t = TONES?.[tone] ?? TONES.info;
  if (!text) {
    return null;
  }
  return (
    <View style={[styles.card, { backgroundColor: t.bg }, style]}>
      <Text style={styles.emoji}>{t.emoji}</Text>
      <Text style={[styles.text, { color: t.fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  emoji: { fontSize: 22, marginRight: 10 },
  text: { fontSize: 16, fontWeight: '700', flex: 1, lineHeight: 21 },
});
