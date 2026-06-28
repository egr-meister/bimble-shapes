// A friendly empty / safe-fallback panel. Never blank, never scary.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from '../theme/colors';

export default function EmptyState({ emoji = '🧩', title, message, style }) {
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.emoji}>{emoji}</Text>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.border,
  },
  emoji: { fontSize: 46, marginBottom: 10 },
  title: { fontSize: 19, fontWeight: '800', color: colors.text, textAlign: 'center' },
  message: { fontSize: 15, color: colors.mutedText, textAlign: 'center', marginTop: 6, lineHeight: 21 },
});
