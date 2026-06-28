// Free Build — open creative play. No scoring, no failure, no saving.
// Keep-awake is active only on this screen.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import FreeBuildCanvas from '../components/FreeBuildCanvas';
import ShapePiece from '../components/ShapePiece';
import colors from '../theme/colors';
import { SHAPE_TYPES, getShapeLabel } from '../data/shapeItems';
import { activateGameKeepAwake, deactivateGameKeepAwake } from '../utils/immersiveHelpers';

const COLORS = ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink'];

export default function FreeBuildScreen({ navigation }) {
  const [shapes, setShapes] = useState([]);
  const counter = useRef(0);
  const colorIndex = useRef(0);

  // Keep awake only while this creative screen is mounted.
  useEffect(() => {
    activateGameKeepAwake();
    return () => {
      deactivateGameKeepAwake();
    };
  }, []);

  const addShape = (shapeType) => {
    counter.current += 1;
    const colorKey = COLORS[colorIndex.current % COLORS.length];
    colorIndex.current += 1;
    const jitterX = (counter.current % 5) * 18;
    const jitterY = (counter.current % 3) * 16;
    const newShape = {
      id: `free_${counter.current}`,
      shapeType,
      colorKey,
      size: 70,
      startX: 30 + jitterX,
      startY: 24 + jitterY,
    };
    setShapes((prev) => [...prev, newShape]);
  };

  const clearAll = () => setShapes([]);

  return (
    <ScreenContainer scroll={false} decor={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Free Build</Text>
        <Text style={styles.subtitle}>Make your own shape friend.</Text>
      </View>

      <FreeBuildCanvas shapes={shapes} style={styles.canvas} />

      <View style={styles.palette}>
        {SHAPE_TYPES.map((type, index) => (
          <Pressable
            key={type}
            onPress={() => addShape(type)}
            accessibilityRole="button"
            accessibilityLabel={`Add ${getShapeLabel(type)}`}
            style={({ pressed }) => [styles.paletteBtn, pressed ? styles.pressed : null]}
          >
            <ShapePiece shapeType={type} colorKey={COLORS[index % COLORS.length]} size={34} />
            <Text style={styles.paletteLabel}>Add {getShapeLabel(type)}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Clear"
          emoji="🧹"
          variant="accent"
          fullWidth={false}
          style={styles.actionBtn}
          onPress={clearAll}
        />
        <AppButton
          label="Home"
          emoji="🏠"
          variant="soft"
          fullWidth={false}
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 10 },
  title: { fontSize: 30, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: 16, color: colors.mutedText, marginTop: 2 },
  canvas: { marginBottom: 12 },
  palette: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  paletteBtn: {
    width: '47%',
    margin: '1.5%',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.98 }], borderColor: colors.primary },
  paletteLabel: { fontSize: 15, fontWeight: '800', color: colors.text, marginLeft: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  actionBtn: { flex: 1, marginHorizontal: 5 },
});
