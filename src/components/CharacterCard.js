// A colorful, selectable character card with a shape preview.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import colors from '../theme/colors';
import CharacterPreview from './CharacterPreview';

export default function CharacterCard({ character, selected = false, completedCount = 0, onPress }) {
  const title = character?.title ?? 'Friend';
  const description = character?.description ?? '';
  const emoji = character?.emoji ?? '⭐';
  const isComplete = (completedCount ?? 0) > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Choose ${title}`}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.previewBox}>
        <CharacterPreview characterId={character?.id} difficulty="easy" width={92} />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <Text style={styles.desc} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.statusRow}>
          {isComplete ? (
            <Text style={styles.statusDone}>✅ Built {completedCount}×</Text>
          ) : (
            <Text style={styles.statusNew}>Not built yet</Text>
          )}
        </View>
      </View>

      {selected ? (
        <View style={styles.check}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F3F2FF',
  },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.95 },
  previewBox: {
    width: 96,
    height: 116,
    backgroundColor: colors.board,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  emoji: { fontSize: 22, marginRight: 8 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, flexShrink: 1 },
  desc: { fontSize: 14, color: colors.mutedText, lineHeight: 19 },
  statusRow: { marginTop: 8 },
  statusDone: { fontSize: 13, fontWeight: '700', color: colors.success },
  statusNew: { fontSize: 13, fontWeight: '700', color: colors.mutedText },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
});
