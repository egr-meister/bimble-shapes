// Home — a playful shape workshop entry point.

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import CharacterPreview from '../components/CharacterPreview';
import colors from '../theme/colors';
import { loadAppData } from '../storage/appStorage';
import { getStickerIds } from '../utils/progressHelpers';

export default function BimbleHomeScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [stickerCount, setStickerCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const data = await loadAppData();
        if (!active) {
          return;
        }
        setStats(data?.stats ?? null);
        setStickerCount(getStickerIds(data?.progress).length);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const completed = stats?.completedCharacters ?? 0;
  const shapesPlaced = stats?.shapesPlaced ?? 0;
  const hasProgress = completed > 0 || shapesPlaced > 0 || stickerCount > 0;

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Bimble Shapes</Text>
        <Text style={styles.subtitle}>Build funny friends from simple shapes.</Text>
      </View>

      <View style={styles.boardWrap}>
        <View style={styles.board}>
          <CharacterPreview characterId="robot" difficulty="medium" width={150} />
        </View>
      </View>

      <View style={styles.progressCard}>
        {hasProgress ? (
          <View style={styles.progressRow}>
            <Progress emoji="🏅" value={completed} label="Friends built" />
            <Progress emoji="🔷" value={shapesPlaced} label="Shapes placed" />
            <Progress emoji="⭐" value={stickerCount} label="Stickers" />
          </View>
        ) : (
          <Text style={styles.emptyText}>Build your first Bimble friend.</Text>
        )}
      </View>

      <View style={styles.buttons}>
        <AppButton
          label="Start Building"
          emoji="🧩"
          variant="primary"
          onPress={() => navigation.navigate('CharacterPicker')}
        />
        <View style={styles.gap} />
        <AppButton
          label="Free Build"
          emoji="🎨"
          variant="secondary"
          onPress={() => navigation.navigate('FreeBuild')}
        />
        <View style={styles.gap} />
        <AppButton
          label="My Stickers"
          emoji="⭐"
          variant="accent"
          onPress={() => navigation.navigate('StickerProgress')}
        />
        <View style={styles.gap} />
        <AppButton
          label="Parent Settings"
          emoji="⚙️"
          variant="soft"
          onPress={() => navigation.navigate('ParentSettings')}
        />
      </View>
    </ScreenContainer>
  );
}

function Progress({ emoji, value, label }) {
  return (
    <View style={styles.progressItem}>
      <Text style={styles.progressEmoji}>{emoji}</Text>
      <Text style={styles.progressValue}>{value}</Text>
      <Text style={styles.progressLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: 10, marginBottom: 8 },
  title: { fontSize: 38, fontWeight: '900', color: colors.primary, letterSpacing: 0.5 },
  subtitle: { fontSize: 16, color: colors.mutedText, marginTop: 6, textAlign: 'center' },
  boardWrap: { alignItems: 'center', marginVertical: 14 },
  board: {
    backgroundColor: colors.board,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-around' },
  progressItem: { alignItems: 'center', flex: 1 },
  progressEmoji: { fontSize: 24 },
  progressValue: { fontSize: 24, fontWeight: '900', color: colors.text, marginTop: 2 },
  progressLabel: { fontSize: 12, color: colors.mutedText, marginTop: 2, textAlign: 'center' },
  emptyText: { fontSize: 17, color: colors.text, textAlign: 'center', fontWeight: '700' },
  buttons: { marginTop: 4 },
  gap: { height: 12 },
});
