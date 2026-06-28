// A small rounded statistic tile.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from '../theme/colors';

export default function StatCard({ label, value, emoji, accent = colors.primary, style }) {
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.iconWrap, { backgroundColor: accent }]}>
        <Text style={styles.emoji}>{emoji ?? '⭐'}</Text>
      </View>
      <Text style={styles.value}>{value ?? 0}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {label ?? ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    minHeight: 120,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: { fontSize: 22 },
  value: { fontSize: 26, fontWeight: '900', color: colors.text },
  label: { fontSize: 13, color: colors.mutedText, textAlign: 'center', marginTop: 2 },
});
