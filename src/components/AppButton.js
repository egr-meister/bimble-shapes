// Large, child-friendly button with big tap targets.

import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';

import colors from '../theme/colors';

const VARIANTS = {
  primary: { bg: colors.primary, fg: '#FFFFFF' },
  secondary: { bg: colors.secondary, fg: '#FFFFFF' },
  accent: { bg: colors.accent, fg: colors.text },
  soft: { bg: colors.card, fg: colors.text },
  danger: { bg: colors.danger, fg: '#FFFFFF' },
};

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  emoji,
  disabled = false,
  style,
  fullWidth = true,
}) {
  const v = VARIANTS?.[variant] ?? VARIANTS.primary;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        { backgroundColor: v.bg },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <View style={styles.inner}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <Text style={[styles.label, { color: v.fg }]} numberOfLines={1}>
          {label ?? ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 64,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  fullWidth: { alignSelf: 'stretch' },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 24, marginRight: 10 },
  label: { fontSize: 20, fontWeight: '800', letterSpacing: 0.3 },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  disabled: { opacity: 0.5 },
});
