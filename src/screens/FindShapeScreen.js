// "Find the Shape" — a calm matching task. No timer, no pressure.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import ScreenContainer from '../components/ScreenContainer';
import AppButton from '../components/AppButton';
import HintCard from '../components/HintCard';
import ShapePiece from '../components/ShapePiece';
import colors from '../theme/colors';
import { buildFindShapeQuestion, isCorrectAnswer } from '../utils/shapeGameHelpers';
import { getShapeLabel, SHAPE_COLORS } from '../data/shapeItems';
import { loadAppData, recordShapeAnswer } from '../storage/appStorage';

const CHOICE_COLORS = ['blue', 'green', 'orange', 'purple'];

export default function FindShapeScreen({ navigation, route }) {
  const [difficulty, setDifficulty] = useState(route?.params?.difficulty ?? 'easy');
  const [question, setQuestion] = useState(() => buildFindShapeQuestion(route?.params?.difficulty ?? 'easy'));
  const [feedback, setFeedback] = useState({ text: '', tone: 'info' });
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState({ correct: 0, tries: 0 });
  const timerRef = useRef(null);

  // Use the parent's default difficulty if none was passed in.
  useEffect(() => {
    let active = true;
    (async () => {
      if (route?.params?.difficulty) {
        return;
      }
      const data = await loadAppData();
      if (active) {
        const d = data?.settings?.defaultDifficulty ?? 'easy';
        setDifficulty(d);
        setQuestion(buildFindShapeQuestion(d));
      }
    })();
    return () => {
      active = false;
    };
  }, [route]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const nextQuestion = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setSolved(false);
    setFeedback({ text: '', tone: 'info' });
    setQuestion(buildFindShapeQuestion(difficulty));
  }, [difficulty]);

  const onChoose = (choice) => {
    if (solved) {
      return;
    }
    const correct = isCorrectAnswer(choice?.shapeType, question?.correctShapeType);
    recordShapeAnswer(correct);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), tries: s.tries + 1 }));

    if (correct) {
      setSolved(true);
      setFeedback({ text: 'Great find!', tone: 'success' });
      timerRef.current = setTimeout(nextQuestion, 1100);
    } else {
      setFeedback({ text: 'Good try. Look at the shape again.', tone: 'gentle' });
    }
  };

  const choices = question?.choices ?? [];

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Find the Shape</Text>
      <Text style={styles.score}>
        Great finds: {score.correct}
      </Text>

      <View style={styles.promptCard}>
        <Text style={styles.prompt}>{question?.prompt ?? 'Find the shape.'}</Text>
        <View style={styles.targetBox}>
          <ShapePiece shapeType={question?.correctShapeType} colorKey="accent" size={64} />
        </View>
        <Text style={styles.targetName}>{getShapeLabel(question?.correctShapeType)}</Text>
      </View>

      <View style={styles.choices}>
        {choices.map((choice, index) => (
          <Pressable
            key={choice.id}
            onPress={() => onChoose(choice)}
            accessibilityRole="button"
            accessibilityLabel={`Choose ${choice.label}`}
            style={({ pressed }) => [styles.choice, pressed ? styles.choicePressed : null]}
          >
            <ShapePiece
              shapeType={choice.shapeType}
              colorKey={CHOICE_COLORS[index % CHOICE_COLORS.length] ?? SHAPE_COLORS[0]}
              size={56}
            />
            <Text style={styles.choiceLabel}>{choice.label}</Text>
          </Pressable>
        ))}
      </View>

      {feedback.text ? <HintCard text={feedback.text} tone={feedback.tone} style={styles.hint} /> : null}

      <View style={styles.actions}>
        <AppButton label="New Shape" emoji="🔄" variant="primary" onPress={nextQuestion} />
        <View style={styles.gap} />
        <AppButton label="Back" emoji="⬅️" variant="soft" onPress={() => navigation.goBack()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 6 },
  score: { fontSize: 15, color: colors.mutedText, fontWeight: '700', marginTop: 4, marginBottom: 14 },
  promptCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18,
  },
  prompt: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  targetBox: {
    marginTop: 16,
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.board,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetName: { fontSize: 16, color: colors.mutedText, marginTop: 10, fontWeight: '700' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  choice: {
    width: 130,
    height: 130,
    margin: 8,
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choicePressed: { transform: [{ scale: 0.97 }], borderColor: colors.primary },
  choiceLabel: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 12 },
  hint: { marginTop: 16 },
  actions: { marginTop: 18 },
  gap: { height: 12 },
});
