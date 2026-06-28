// The main shape-building activity with simple, stable drag-and-drop.
// No timer, no pressure. Keep-awake is active only on this screen.

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  useWindowDimensions,
} from 'react-native';

import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import BuildBoard from '../components/BuildBoard';
import HintCard from '../components/HintCard';
import ShapePiece from '../components/ShapePiece';
import colors from '../theme/colors';

import { getCharacterItem } from '../data/characterItems';
import {
  createCharacterBuildState,
  checkPieceMatchesSlot,
  placePiece,
  returnPieceToStart,
  isCharacterComplete,
  getPlacedPieceCount,
  getRequiredPieceCount,
  getHintForPiece,
  DIFFICULTIES,
} from '../utils/characterBuildHelpers';
import { findSlotAtPoint } from '../utils/dragDropHelpers';
import { loadAppData } from '../storage/appStorage';
import { recordCharacterResult } from '../storage/appStorage';
import { playCorrectSoundIfEnabled, playCompletionSoundIfEnabled } from '../utils/soundHelpers';
import { activateGameKeepAwake, deactivateGameKeepAwake } from '../utils/immersiveHelpers';
import { getNowIso } from '../utils/dateUtils';

const HIT_PADDING = 22; // forgiving drop zones for small hands
const CONFETTI_COLORS = ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink'];

// ---- A single draggable shape from the tray -------------------------------
function DraggablePiece({ piece, size, onDragMove, onDragRelease }) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const handlers = useRef({ onDragMove, onDragRelease });
  handlers.current.onDragMove = onDragMove;
  handlers.current.onDragRelease = onDragRelease;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, g) => {
        pan.x.setValue(g.dx);
        pan.y.setValue(g.dy);
        if (handlers.current.onDragMove) {
          handlers.current.onDragMove({ x: g.moveX, y: g.moveY });
        }
      },
      onPanResponderRelease: (e, g) => {
        pan.flattenOffset();
        const handled = handlers.current.onDragRelease
          ? handlers.current.onDragRelease({ x: g.moveX, y: g.moveY }, piece)
          : false;
        if (!handled) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 6,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.trayItem,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
    >
      <View style={styles.trayShape}>
        <ShapePiece shapeType={piece?.shapeType} colorKey={piece?.colorKey} size={size} softShadow />
      </View>
      <Text style={styles.trayLabel} numberOfLines={1}>
        {piece?.label ?? 'Shape'}
      </Text>
    </Animated.View>
  );
}

// ---- Completion confetti (simple fading dots) -----------------------------
function Confetti({ progress }) {
  const dots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i += 1) {
      arr.push({
        id: `dot_${i}`,
        left: 12 + Math.random() * 76, // percent
        top: 10 + Math.random() * 70, // percent
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 10 + Math.round(Math.random() * 12),
      });
    }
    return arr;
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {dots.map((d) => (
        <Animated.View
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            borderRadius: d.size / 2,
            backgroundColor: colors?.[d.color] ?? colors.primary,
            opacity: progress,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

export default function CharacterBuildScreen({ navigation, route }) {
  const characterId = route?.params?.characterId ?? 'cat';
  const difficulty = route?.params?.difficulty ?? 'easy';
  const character = getCharacterItem(characterId);
  const diffLabel = (DIFFICULTIES.find((d) => d.id === difficulty) ?? DIFFICULTIES[0]).title;

  const { width } = useWindowDimensions();
  const boardWidth = Math.min(Math.max(width - 60, 240), 320);

  const [buildState, setBuildState] = useState(() =>
    createCharacterBuildState(characterId, difficulty)
  );
  const [settings, setSettings] = useState(null);
  const [boardLayout, setBoardLayout] = useState(null);
  const [highlightedSlotId, setHighlightedSlotId] = useState(null);
  const [hint, setHint] = useState({ text: 'Drag shapes to build your friend.', tone: 'info' });
  const [completed, setCompleted] = useState(false);

  const boardLayoutRef = useRef(null);
  const buildStateRef = useRef(buildState);
  const recordedRef = useRef(false);
  const completionAnim = useRef(new Animated.Value(0)).current;

  buildStateRef.current = buildState;
  boardLayoutRef.current = boardLayout;

  // Load settings once.
  useEffect(() => {
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
  }, []);

  // Keep awake only while this build screen is mounted.
  useEffect(() => {
    activateGameKeepAwake();
    return () => {
      deactivateGameKeepAwake();
    };
  }, []);

  const slotRects = useCallback(() => {
    const layout = boardLayoutRef.current;
    const state = buildStateRef.current;
    if (!layout || !state) {
      return [];
    }
    const { pageX, pageY, scale } = layout;
    return (state.slots ?? []).map((slot) => ({
      slotId: slot.id,
      rect: {
        x: pageX + slot.x * scale - HIT_PADDING,
        y: pageY + slot.y * scale - HIT_PADDING,
        width: slot.width * scale + HIT_PADDING * 2,
        height: slot.height * scale + HIT_PADDING * 2,
      },
    }));
  }, []);

  const handleDragMove = useCallback(
    (point) => {
      const slotId = findSlotAtPoint(point, slotRects());
      setHighlightedSlotId(slotId);
    },
    [slotRects]
  );

  const finishCompletion = useCallback(
    (finalState) => {
      if (recordedRef.current) {
        return;
      }
      recordedRef.current = true;
      playCompletionSoundIfEnabled(settings);
      setCompleted(true);

      recordCharacterResult({
        characterId,
        difficulty,
        shapesPlaced: getPlacedPieceCount(finalState),
        completedAt: getNowIso(),
      });

      const animationsEnabled = settings?.completionAnimationEnabled ?? true;
      if (animationsEnabled) {
        Animated.spring(completionAnim, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }).start();
      } else {
        completionAnim.setValue(1);
      }
      // The build is done; no need to keep the screen awake any longer.
      deactivateGameKeepAwake();
    },
    [characterId, difficulty, settings, completionAnim]
  );

  const handleDragRelease = useCallback(
    (point, piece) => {
      setHighlightedSlotId(null);
      const state = buildStateRef.current;
      if (!state || !piece) {
        return false;
      }

      const slotId = findSlotAtPoint(point, slotRects());
      const slot = (state.slots ?? []).find((s) => s.id === slotId) ?? null;
      const alreadyPlaced = (state.placedPieceIds ?? []).includes(piece.id);

      if (slot && !alreadyPlaced && checkPieceMatchesSlot(piece, slot)) {
        const next = placePiece(state, piece.id, slot.id);
        setBuildState(next);
        playCorrectSoundIfEnabled(settings);
        setHint({ text: pickPraise(), tone: 'success' });
        if (isCharacterComplete(next)) {
          finishCompletion(next);
        }
        return true; // handled: piece is placed, tray re-renders without it
      }

      // Gentle, non-punishing miss.
      const next = returnPieceToStart(state, piece.id);
      setBuildState(next);
      if (settings?.hintsEnabled ?? true) {
        setHint({ text: getHintForPiece(piece, slot), tone: 'gentle' });
      } else {
        setHint({ text: 'Good try. Try another spot.', tone: 'gentle' });
      }
      return false; // springs back to start
    },
    [settings, slotRects, finishCompletion]
  );

  const placedCount = getPlacedPieceCount(buildState);
  const requiredCount = getRequiredPieceCount(buildState);
  const trayPieces = (buildState?.pieces ?? []).filter(
    (p) => !(buildState?.placedPieceIds ?? []).includes(p.id)
  );

  return (
    <ScreenContainer scroll={false} decor={false}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {character?.emoji} Build the {character?.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Difficulty: {diffLabel}</Text>
          <Text style={styles.meta}>
            Shapes: {placedCount}/{requiredCount}
          </Text>
        </View>
      </View>

      <BuildBoard
        slots={buildState?.slots ?? []}
        pieces={buildState?.pieces ?? []}
        placedPieceIds={buildState?.placedPieceIds ?? []}
        highlightedSlotId={highlightedSlotId}
        boardWidth={boardWidth}
        onBoardMeasured={setBoardLayout}
      />

      <HintCard text={hint.text} tone={hint.tone} style={styles.hint} />

      <View style={styles.trayWrap}>
        {trayPieces.length === 0 ? (
          <Text style={styles.trayDone}>All shapes placed! 🎉</Text>
        ) : (
          trayPieces.map((piece) => (
            <DraggablePiece
              key={piece.id}
              piece={piece}
              size={54}
              onDragMove={handleDragMove}
              onDragRelease={handleDragRelease}
            />
          ))
        )}
      </View>

      {completed ? (
        <View style={styles.overlay}>
          <Confetti progress={completionAnim} />
          <Animated.View
            style={[
              styles.completePanel,
              {
                opacity: completionAnim,
                transform: [
                  {
                    scale: completionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.completeEmoji}>{character?.emoji} 🎉</Text>
            <Text style={styles.completeTitle}>Bimble friend complete!</Text>
            <Text style={styles.completeText}>Well done! You built the {character?.title}.</Text>

            <View style={styles.completeButtons}>
              <AppButton
                label="See My Stickers"
                emoji="⭐"
                variant="accent"
                onPress={() => navigation.navigate('StickerProgress')}
              />
              <View style={styles.gap} />
              <AppButton
                label="Build Another"
                emoji="🧩"
                variant="primary"
                onPress={() => navigation.navigate('CharacterPicker')}
              />
              <View style={styles.gap} />
              <AppButton
                label="Home"
                emoji="🏠"
                variant="soft"
                onPress={() => navigation.navigate('Home')}
              />
            </View>
          </Animated.View>
        </View>
      ) : null}

      {!completed ? (
        <View style={styles.bottomBar}>
          <AppButton
            label="Find Shapes"
            emoji="🔎"
            variant="secondary"
            fullWidth={false}
            style={styles.bottomBtn}
            onPress={() => navigation.navigate('FindShape', { difficulty })}
          />
          <AppButton
            label="Back"
            emoji="⬅️"
            variant="soft"
            fullWidth={false}
            style={styles.bottomBtn}
            onPress={() => navigation.goBack()}
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

function pickPraise() {
  const options = ['Great shape!', 'That fits!', 'Your Bimble friend is growing!', 'Well done!'];
  return options[Math.floor(Math.random() * options.length)];
}

const styles = StyleSheet.create({
  header: { marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '900', color: colors.text, textAlign: 'center' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 6 },
  meta: { fontSize: 14, fontWeight: '700', color: colors.mutedText },
  hint: { marginTop: 12 },
  trayWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  trayItem: {
    width: 80,
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 8,
    zIndex: 20,
    elevation: 12,
  },
  trayShape: {
    width: 78,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.border,
  },
  trayLabel: { fontSize: 12, color: colors.mutedText, marginTop: 4, fontWeight: '700' },
  trayDone: { fontSize: 16, fontWeight: '800', color: colors.success, marginTop: 10 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46,52,64,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  completePanel: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.accent,
  },
  completeEmoji: { fontSize: 46 },
  completeTitle: { fontSize: 26, fontWeight: '900', color: colors.primary, marginTop: 8, textAlign: 'center' },
  completeText: { fontSize: 16, color: colors.mutedText, marginTop: 6, textAlign: 'center' },
  completeButtons: { marginTop: 20, alignSelf: 'stretch' },
  gap: { height: 12 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 12,
  },
  bottomBtn: { flex: 1, marginHorizontal: 5 },
});
