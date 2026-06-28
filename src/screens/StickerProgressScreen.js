// Stickers & progress. Local learning markers only — no rankings, no monetary value.

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import StatCard from '../components/StatCard';
import StickerBadge from '../components/StickerBadge';
import EmptyState from '../components/EmptyState';
import colors from '../theme/colors';
import { STICKER_ITEMS } from '../data/stickerItems';
import { CHARACTER_ITEMS } from '../data/characterItems';
import { loadAppData, resetBimbleStats, resetBimbleProgress } from '../storage/appStorage';
import { getStickerIds } from '../utils/progressHelpers';

export default function StickerProgressScreen({ navigation }) {
  const [data, setData] = useState(null);

  const reload = useCallback(() => {
    let active = true;
    (async () => {
      const loaded = await loadAppData();
      if (active) {
        setData(loaded);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(reload);

  const stats = data?.stats ?? null;
  const unlockedIds = getStickerIds(data?.progress);

  const completed = stats?.completedCharacters ?? 0;
  const shapesPlaced = stats?.shapesPlaced ?? 0;
  const findCorrect = stats?.findShapeCorrect ?? 0;
  const findIncorrect = stats?.findShapeIncorrect ?? 0;

  const hasProgress =
    completed > 0 ||
    shapesPlaced > 0 ||
    findCorrect > 0 ||
    findIncorrect > 0 ||
    unlockedIds.length > 0;

  const onReset = () => {
    Alert.alert('Reset Progress', 'Are you sure you want to reset Bimble progress?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await resetBimbleStats();
          await resetBimbleProgress();
          reload();
        },
      },
    ]);
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Stickers & Progress</Text>
      <Text style={styles.subtitle}>
        Stickers are simple learning markers. They have no monetary value.
      </Text>

      {!hasProgress ? (
        <EmptyState
          emoji="🧩"
          title="No Bimble progress yet."
          message="Build a friend or find some shapes to earn your first sticker."
          style={styles.empty}
        />
      ) : (
        <>
          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <StatCard label="Friends built" value={completed} emoji="🏅" accent={colors.primary} />
            </View>
            <View style={styles.statCol}>
              <StatCard label="Shapes placed" value={shapesPlaced} emoji="🔷" accent={colors.secondary} />
            </View>
            <View style={styles.statCol}>
              <StatCard label="Great finds" value={findCorrect} emoji="✅" accent={colors.success} />
            </View>
            <View style={styles.statCol}>
              <StatCard label="Tries to learn" value={findIncorrect} emoji="🙂" accent={colors.accent} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Friends Completed</Text>
          <View style={styles.byCharRow}>
            {CHARACTER_ITEMS.map((c) => (
              <View key={c.id} style={styles.byCharItem}>
                <Text style={styles.byCharEmoji}>{c.emoji}</Text>
                <Text style={styles.byCharCount}>{stats?.byCharacter?.[c.id]?.completed ?? 0}×</Text>
                <Text style={styles.byCharName}>{c.title}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>My Stickers</Text>
      <View style={styles.stickerGrid}>
        {STICKER_ITEMS.map((sticker) => (
          <View key={sticker.id} style={styles.stickerCol}>
            <StickerBadge sticker={sticker} unlocked={unlockedIds.includes(sticker.id)} />
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <AppButton label="Reset Progress" emoji="♻️" variant="danger" onPress={onReset} />
        <View style={styles.gap} />
        <AppButton label="Back Home" emoji="🏠" variant="soft" onPress={() => navigation.navigate('Home')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 6 },
  subtitle: { fontSize: 14, color: colors.mutedText, marginTop: 4, marginBottom: 16, lineHeight: 19 },
  empty: { marginBottom: 18 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  statCol: { width: '50%', paddingHorizontal: 5, marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 12, marginBottom: 10 },
  byCharRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 12,
  },
  byCharItem: { alignItems: 'center', flex: 1 },
  byCharEmoji: { fontSize: 24 },
  byCharCount: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 2 },
  byCharName: { fontSize: 11, color: colors.mutedText, marginTop: 2, textAlign: 'center' },
  stickerGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  stickerCol: { width: '50%', paddingHorizontal: 5, marginBottom: 10 },
  actions: { marginTop: 12 },
  gap: { height: 12 },
});
