// Choose a difficulty for the build.

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import DifficultyChip from '../components/DifficultyChip';
import HintCard from '../components/HintCard';
import CharacterPreview from '../components/CharacterPreview';
import colors from '../theme/colors';
import { DIFFICULTIES } from '../utils/characterBuildHelpers';
import { getCharacterItem } from '../data/characterItems';
import { loadAppData } from '../storage/appStorage';

export default function DifficultyScreen({ navigation, route }) {
  const characterId = route?.params?.characterId ?? 'cat';
  const character = getCharacterItem(characterId);

  const [difficulty, setDifficulty] = useState(null);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const data = await loadAppData();
        if (active && !difficulty) {
          setDifficulty(data?.settings?.defaultDifficulty ?? 'easy');
        }
      })();
      return () => {
        active = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const onStart = () => {
    if (!difficulty) {
      setError('Please choose a difficulty.');
      return;
    }
    setError('');
    navigation.navigate('CharacterBuild', { characterId, difficulty });
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Choose Difficulty</Text>
      <View style={styles.charRow}>
        <View style={styles.previewBox}>
          <CharacterPreview characterId={characterId} difficulty="easy" width={70} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.charName}>
            {character?.emoji} {character?.title}
          </Text>
          <Text style={styles.charDesc}>{character?.description}</Text>
        </View>
      </View>

      {DIFFICULTIES.map((option) => (
        <DifficultyChip
          key={option.id}
          option={option}
          selected={difficulty === option.id}
          onPress={() => {
            setDifficulty(option.id);
            setError('');
          }}
        />
      ))}

      {error ? <HintCard text={error} tone="gentle" style={styles.error} /> : null}

      <View style={styles.actions}>
        <AppButton label="Start Build" emoji="🚀" variant="primary" onPress={onStart} />
        <View style={styles.gap} />
        <AppButton label="Back" emoji="⬅️" variant="soft" onPress={() => navigation.goBack()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 6, marginBottom: 14 },
  charRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 18,
  },
  previewBox: {
    width: 74,
    height: 90,
    backgroundColor: colors.board,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  charName: { fontSize: 20, fontWeight: '800', color: colors.text },
  charDesc: { fontSize: 14, color: colors.mutedText, marginTop: 2 },
  error: { marginBottom: 12 },
  actions: { marginTop: 4 },
  gap: { height: 12 },
});
