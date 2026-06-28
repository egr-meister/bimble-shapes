// Parent settings — calm controls + privacy and child-safety notes.

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import colors from '../theme/colors';
import { loadAppData, updateSettings, clearAllData } from '../storage/appStorage';

function Segmented({ options, value, onChange }) {
  return (
    <View style={styles.segment}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => onChange(opt.value)}
            accessibilityRole="button"
            accessibilityLabel={opt.label}
            style={[styles.segmentBtn, active ? styles.segmentActive : null]}
          >
            <Text style={[styles.segmentText, active ? styles.segmentTextActive : null]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SettingRow({ title, note, children }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      {children}
      {note ? <Text style={styles.rowNote}>{note}</Text> : null}
    </View>
  );
}

function InfoCard({ title, text }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const ON_OFF = [
  { label: 'On', value: true },
  { label: 'Off', value: false },
];

const DIFFICULTY_OPTIONS = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

export default function ParentSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const data = await loadAppData();
        if (active) {
          setSettings(data?.settings ?? null);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const apply = async (patch) => {
    const next = { ...(settings ?? {}), ...patch };
    setSettings(next);
    await updateSettings(patch);
  };

  const onClearAll = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all local Bimble progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const fresh = await clearAllData();
            setSettings(fresh?.settings ?? null);
          },
        },
      ]
    );
  };

  const soundEnabled = settings?.soundEnabled ?? true;
  const defaultDifficulty = settings?.defaultDifficulty ?? 'easy';
  const hintsEnabled = settings?.hintsEnabled ?? true;
  const completionAnimationEnabled = settings?.completionAnimationEnabled ?? true;

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Parent Settings</Text>

      <SettingRow title="Sound" note="Gentle success sounds can be turned off anytime.">
        <Segmented options={ON_OFF} value={soundEnabled} onChange={(v) => apply({ soundEnabled: v })} />
      </SettingRow>

      <SettingRow title="Default Difficulty">
        <Segmented
          options={DIFFICULTY_OPTIONS}
          value={defaultDifficulty}
          onChange={(v) => apply({ defaultDifficulty: v })}
        />
      </SettingRow>

      <SettingRow title="Shape Hints" note="Hints help children match shapes calmly.">
        <Segmented options={ON_OFF} value={hintsEnabled} onChange={(v) => apply({ hintsEnabled: v })} />
      </SettingRow>

      <SettingRow title="Completion Animation" note="Completion animation is soft and can be turned off.">
        <Segmented
          options={ON_OFF}
          value={completionAnimationEnabled}
          onChange={(v) => apply({ completionAnimationEnabled: v })}
        />
      </SettingRow>

      <SettingRow title="Theme" note="Bimble Shapes uses a bright but calm workshop theme.">
        <View style={styles.themePill}>
          <Text style={styles.themePillText}>Bimble Workshop</Text>
        </View>
      </SettingRow>

      <InfoCard
        title="Sticker Progress"
        text="Stickers are simple learning markers inside the app. They have no monetary value."
      />
      <InfoCard
        title="Privacy Note"
        text="Bimble Shapes does not collect personal data. The app works offline and stores progress, stickers, statistics, and settings only on this device."
      />
      <InfoCard
        title="Child-Friendly Note"
        text="There are no ads, purchases, accounts, internet access, social sharing, or leaderboards."
      />

      <View style={styles.actions}>
        <AppButton label="Clear All Data" emoji="🗑️" variant="danger" onPress={onClearAll} />
        <View style={styles.gap} />
        <AppButton label="Back Home" emoji="🏠" variant="soft" onPress={() => navigation.navigate('Home')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 6, marginBottom: 14 },
  row: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  rowTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 10 },
  rowNote: { fontSize: 13, color: colors.mutedText, marginTop: 10, lineHeight: 18 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.workshopBg,
    borderRadius: 16,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { fontSize: 16, fontWeight: '800', color: colors.mutedText },
  segmentTextActive: { color: '#FFFFFF' },
  themePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.workshopBg,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  themePillText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  infoCard: {
    backgroundColor: '#F7F9FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 16,
    marginBottom: 12,
  },
  infoTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 6 },
  infoText: { fontSize: 14, color: colors.mutedText, lineHeight: 20 },
  actions: { marginTop: 6 },
  gap: { height: 12 },
});
