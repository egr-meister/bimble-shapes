// Choose a Bimble friend to build.

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import CharacterCard from '../components/CharacterCard';
import HintCard from '../components/HintCard';
import colors from '../theme/colors';
import { CHARACTER_ITEMS } from '../data/characterItems';
import { loadAppData } from '../storage/appStorage';

export default function CharacterPickerScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');
  const [byCharacter, setByCharacter] = useState({});

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const data = await loadAppData();
        if (active) {
          setByCharacter(data?.stats?.byCharacter ?? {});
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const onContinue = () => {
    if (!selectedId) {
      setError('Please choose a Bimble friend.');
      return;
    }
    setError('');
    navigation.navigate('Difficulty', { characterId: selectedId });
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Pick a Friend</Text>
      <Text style={styles.subtitle}>Who would you like to build today?</Text>

      {CHARACTER_ITEMS.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          selected={selectedId === character.id}
          completedCount={byCharacter?.[character.id]?.completed ?? 0}
          onPress={() => {
            setSelectedId(character.id);
            setError('');
          }}
        />
      ))}

      {error ? <HintCard text={error} tone="gentle" style={styles.error} /> : null}

      <View style={styles.actions}>
        <AppButton label="Continue" emoji="➡️" variant="primary" onPress={onContinue} />
        <View style={styles.gap} />
        <AppButton
          label="Back Home"
          emoji="🏠"
          variant="soft"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 6 },
  subtitle: { fontSize: 16, color: colors.mutedText, marginBottom: 16, marginTop: 4 },
  error: { marginBottom: 12 },
  actions: { marginTop: 4, marginBottom: 8 },
  gap: { height: 12 },
});
