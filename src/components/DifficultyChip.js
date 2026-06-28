// A large, selectable difficulty option.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import colors from '../theme/colors';

const ICONS = { easy: '🟢', medium: '🟡', hard: '🟣' };

export default function DifficultyChip({ option, selected = false, onPress }) {
  const id = option?.id ?? 'easy';
  const title = option?.title ?? 'Easy';
  const description = option?.description ?? '';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Difficulty ${title}`}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={styles.icon}>{ICONS?.[id] ?? '🟢'}</Text>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
      {selected ? (
        <View style={styles.dot}>
          <Text style={styles.dotText}>✓</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderWidth: 3,
    borderColor: colors.border,
    minHeight: 76,
  },
  selected: { borderColor: colors.primary, backgroundColor: '#F3F2FF' },
  pressed: { opacity: 0.95 },
  icon: { fontSize: 30, marginRight: 16 },
  textCol: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  desc: { fontSize: 14, color: colors.mutedText, marginTop: 2 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
});
