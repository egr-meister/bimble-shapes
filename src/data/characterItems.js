// Static character definitions and shape layouts for Bimble Shapes.
// All characters are built from simple shapes drawn with React Native Views.
// No external art, no copyrighted characters.

// The build board uses this fixed design coordinate space.
// BuildBoard scales these coordinates to fit the device.
export const BUILD_BOARD_WIDTH = 300;
export const BUILD_BOARD_HEIGHT = 360;

export const CHARACTER_ITEMS = [
  { id: 'cat', title: 'Cat', emoji: '🐱', description: 'Build a funny shape cat.' },
  { id: 'robot', title: 'Robot', emoji: '🤖', description: 'Make a square robot friend.' },
  { id: 'bird', title: 'Bird', emoji: '🐦', description: 'Build a bright little bird.' },
  { id: 'monster', title: 'Little Monster', emoji: '👾', description: 'Create a silly shape monster.' },
  { id: 'car', title: 'Car', emoji: '🚗', description: 'Build a happy shape car.' },
];

// Each slot: { id, shapeType, colorKey, x, y, width, height, label }
export const CHARACTER_LAYOUTS = {
  cat: {
    easy: [
      { id: 'cat_head', shapeType: 'circle', colorKey: 'orange', x: 100, y: 80, width: 100, height: 100, label: 'Head' },
      { id: 'cat_body', shapeType: 'rectangle', colorKey: 'orange', x: 85, y: 200, width: 130, height: 90, label: 'Body' },
      { id: 'cat_tail', shapeType: 'triangle', colorKey: 'pink', x: 215, y: 205, width: 60, height: 60, label: 'Tail' },
    ],
    medium: [
      { id: 'cat_head', shapeType: 'circle', colorKey: 'orange', x: 100, y: 95, width: 100, height: 100, label: 'Head' },
      { id: 'cat_ear_l', shapeType: 'triangle', colorKey: 'pink', x: 95, y: 55, width: 50, height: 50, label: 'Left Ear' },
      { id: 'cat_ear_r', shapeType: 'triangle', colorKey: 'pink', x: 155, y: 55, width: 50, height: 50, label: 'Right Ear' },
      { id: 'cat_body', shapeType: 'rectangle', colorKey: 'orange', x: 85, y: 210, width: 130, height: 90, label: 'Body' },
      { id: 'cat_tail', shapeType: 'triangle', colorKey: 'yellow', x: 215, y: 215, width: 55, height: 55, label: 'Tail' },
    ],
    hard: [
      { id: 'cat_head', shapeType: 'circle', colorKey: 'orange', x: 100, y: 80, width: 100, height: 100, label: 'Head' },
      { id: 'cat_ear_l', shapeType: 'triangle', colorKey: 'pink', x: 92, y: 42, width: 50, height: 50, label: 'Left Ear' },
      { id: 'cat_ear_r', shapeType: 'triangle', colorKey: 'pink', x: 158, y: 42, width: 50, height: 50, label: 'Right Ear' },
      { id: 'cat_body', shapeType: 'square', colorKey: 'orange', x: 100, y: 195, width: 100, height: 100, label: 'Body' },
      { id: 'cat_paw_l', shapeType: 'circle', colorKey: 'yellow', x: 90, y: 300, width: 45, height: 45, label: 'Left Paw' },
      { id: 'cat_paw_r', shapeType: 'circle', colorKey: 'yellow', x: 165, y: 300, width: 45, height: 45, label: 'Right Paw' },
      { id: 'cat_tail', shapeType: 'triangle', colorKey: 'orange', x: 215, y: 215, width: 55, height: 55, label: 'Tail' },
    ],
  },

  robot: {
    easy: [
      { id: 'robot_head', shapeType: 'square', colorKey: 'blue', x: 105, y: 70, width: 90, height: 90, label: 'Head' },
      { id: 'robot_body', shapeType: 'rectangle', colorKey: 'purple', x: 80, y: 185, width: 140, height: 110, label: 'Body' },
      { id: 'robot_eye', shapeType: 'circle', colorKey: 'yellow', x: 128, y: 95, width: 45, height: 45, label: 'Eye' },
    ],
    medium: [
      { id: 'robot_antenna', shapeType: 'triangle', colorKey: 'red', x: 128, y: 25, width: 44, height: 44, label: 'Antenna' },
      { id: 'robot_head', shapeType: 'square', colorKey: 'blue', x: 105, y: 75, width: 90, height: 90, label: 'Head' },
      { id: 'robot_eye_l', shapeType: 'circle', colorKey: 'yellow', x: 112, y: 100, width: 36, height: 36, label: 'Left Eye' },
      { id: 'robot_eye_r', shapeType: 'circle', colorKey: 'yellow', x: 152, y: 100, width: 36, height: 36, label: 'Right Eye' },
      { id: 'robot_body', shapeType: 'rectangle', colorKey: 'purple', x: 80, y: 190, width: 140, height: 110, label: 'Body' },
    ],
    hard: [
      { id: 'robot_antenna', shapeType: 'triangle', colorKey: 'red', x: 128, y: 18, width: 44, height: 44, label: 'Antenna' },
      { id: 'robot_head', shapeType: 'square', colorKey: 'blue', x: 105, y: 66, width: 90, height: 90, label: 'Head' },
      { id: 'robot_eye_l', shapeType: 'circle', colorKey: 'yellow', x: 112, y: 90, width: 34, height: 34, label: 'Left Eye' },
      { id: 'robot_eye_r', shapeType: 'circle', colorKey: 'yellow', x: 152, y: 90, width: 34, height: 34, label: 'Right Eye' },
      { id: 'robot_mouth', shapeType: 'rectangle', colorKey: 'green', x: 120, y: 132, width: 60, height: 22, label: 'Mouth' },
      { id: 'robot_body', shapeType: 'square', colorKey: 'purple', x: 100, y: 180, width: 100, height: 100, label: 'Body' },
      { id: 'robot_button', shapeType: 'circle', colorKey: 'orange', x: 132, y: 215, width: 36, height: 36, label: 'Button' },
    ],
  },

  bird: {
    easy: [
      { id: 'bird_body', shapeType: 'circle', colorKey: 'blue', x: 95, y: 130, width: 120, height: 120, label: 'Body' },
      { id: 'bird_beak', shapeType: 'triangle', colorKey: 'yellow', x: 210, y: 165, width: 50, height: 50, label: 'Beak' },
      { id: 'bird_wing', shapeType: 'triangle', colorKey: 'green', x: 120, y: 165, width: 55, height: 55, label: 'Wing' },
    ],
    medium: [
      { id: 'bird_head', shapeType: 'circle', colorKey: 'blue', x: 110, y: 70, width: 80, height: 80, label: 'Head' },
      { id: 'bird_body', shapeType: 'circle', colorKey: 'blue', x: 95, y: 150, width: 120, height: 120, label: 'Body' },
      { id: 'bird_beak', shapeType: 'triangle', colorKey: 'yellow', x: 185, y: 95, width: 46, height: 46, label: 'Beak' },
      { id: 'bird_wing', shapeType: 'triangle', colorKey: 'green', x: 120, y: 185, width: 55, height: 55, label: 'Wing' },
      { id: 'bird_eye', shapeType: 'circle', colorKey: 'yellow', x: 150, y: 90, width: 28, height: 28, label: 'Eye' },
    ],
    hard: [
      { id: 'bird_head', shapeType: 'circle', colorKey: 'blue', x: 110, y: 55, width: 80, height: 80, label: 'Head' },
      { id: 'bird_eye', shapeType: 'circle', colorKey: 'yellow', x: 150, y: 75, width: 26, height: 26, label: 'Eye' },
      { id: 'bird_beak', shapeType: 'triangle', colorKey: 'orange', x: 185, y: 80, width: 44, height: 44, label: 'Beak' },
      { id: 'bird_body', shapeType: 'circle', colorKey: 'blue', x: 95, y: 135, width: 120, height: 120, label: 'Body' },
      { id: 'bird_wing_l', shapeType: 'triangle', colorKey: 'green', x: 80, y: 170, width: 52, height: 52, label: 'Left Wing' },
      { id: 'bird_wing_r', shapeType: 'triangle', colorKey: 'green', x: 178, y: 170, width: 52, height: 52, label: 'Right Wing' },
      { id: 'bird_foot', shapeType: 'rectangle', colorKey: 'yellow', x: 120, y: 270, width: 60, height: 22, label: 'Foot' },
    ],
  },

  monster: {
    easy: [
      { id: 'monster_body', shapeType: 'square', colorKey: 'green', x: 95, y: 130, width: 110, height: 110, label: 'Body' },
      { id: 'monster_eye', shapeType: 'circle', colorKey: 'yellow', x: 128, y: 155, width: 45, height: 45, label: 'Eye' },
      { id: 'monster_horn', shapeType: 'triangle', colorKey: 'purple', x: 128, y: 85, width: 48, height: 48, label: 'Horn' },
    ],
    medium: [
      { id: 'monster_body', shapeType: 'square', colorKey: 'green', x: 95, y: 130, width: 110, height: 110, label: 'Body' },
      { id: 'monster_horn_l', shapeType: 'triangle', colorKey: 'purple', x: 100, y: 85, width: 44, height: 44, label: 'Left Horn' },
      { id: 'monster_horn_r', shapeType: 'triangle', colorKey: 'purple', x: 156, y: 85, width: 44, height: 44, label: 'Right Horn' },
      { id: 'monster_eye_l', shapeType: 'circle', colorKey: 'yellow', x: 112, y: 155, width: 38, height: 38, label: 'Left Eye' },
      { id: 'monster_eye_r', shapeType: 'circle', colorKey: 'yellow', x: 152, y: 155, width: 38, height: 38, label: 'Right Eye' },
    ],
    hard: [
      { id: 'monster_horn_l', shapeType: 'triangle', colorKey: 'purple', x: 100, y: 70, width: 42, height: 42, label: 'Left Horn' },
      { id: 'monster_horn_r', shapeType: 'triangle', colorKey: 'purple', x: 158, y: 70, width: 42, height: 42, label: 'Right Horn' },
      { id: 'monster_body', shapeType: 'square', colorKey: 'green', x: 95, y: 115, width: 110, height: 110, label: 'Body' },
      { id: 'monster_eye_l', shapeType: 'circle', colorKey: 'yellow', x: 110, y: 140, width: 36, height: 36, label: 'Left Eye' },
      { id: 'monster_eye_r', shapeType: 'circle', colorKey: 'yellow', x: 154, y: 140, width: 36, height: 36, label: 'Right Eye' },
      { id: 'monster_mouth', shapeType: 'rectangle', colorKey: 'red', x: 118, y: 185, width: 64, height: 24, label: 'Mouth' },
      { id: 'monster_foot', shapeType: 'square', colorKey: 'blue', x: 120, y: 240, width: 60, height: 40, label: 'Foot' },
    ],
  },

  car: {
    easy: [
      { id: 'car_body', shapeType: 'rectangle', colorKey: 'red', x: 70, y: 150, width: 160, height: 80, label: 'Body' },
      { id: 'car_wheel_l', shapeType: 'circle', colorKey: 'blue', x: 90, y: 215, width: 50, height: 50, label: 'Left Wheel' },
      { id: 'car_wheel_r', shapeType: 'circle', colorKey: 'blue', x: 160, y: 215, width: 50, height: 50, label: 'Right Wheel' },
    ],
    medium: [
      { id: 'car_top', shapeType: 'square', colorKey: 'yellow', x: 115, y: 100, width: 70, height: 60, label: 'Roof' },
      { id: 'car_body', shapeType: 'rectangle', colorKey: 'red', x: 70, y: 155, width: 160, height: 80, label: 'Body' },
      { id: 'car_wheel_l', shapeType: 'circle', colorKey: 'blue', x: 90, y: 220, width: 50, height: 50, label: 'Left Wheel' },
      { id: 'car_wheel_r', shapeType: 'circle', colorKey: 'blue', x: 160, y: 220, width: 50, height: 50, label: 'Right Wheel' },
      { id: 'car_window', shapeType: 'square', colorKey: 'green', x: 130, y: 112, width: 40, height: 40, label: 'Window' },
    ],
    hard: [
      { id: 'car_top', shapeType: 'square', colorKey: 'yellow', x: 110, y: 80, width: 80, height: 65, label: 'Roof' },
      { id: 'car_window', shapeType: 'square', colorKey: 'green', x: 126, y: 92, width: 42, height: 42, label: 'Window' },
      { id: 'car_body', shapeType: 'rectangle', colorKey: 'red', x: 60, y: 145, width: 180, height: 85, label: 'Body' },
      { id: 'car_light', shapeType: 'circle', colorKey: 'yellow', x: 215, y: 165, width: 30, height: 30, label: 'Light' },
      { id: 'car_door', shapeType: 'rectangle', colorKey: 'orange', x: 120, y: 165, width: 60, height: 40, label: 'Door' },
      { id: 'car_wheel_l', shapeType: 'circle', colorKey: 'blue', x: 85, y: 215, width: 52, height: 52, label: 'Left Wheel' },
      { id: 'car_wheel_r', shapeType: 'circle', colorKey: 'blue', x: 165, y: 215, width: 52, height: 52, label: 'Right Wheel' },
    ],
  },
};

// One distractor piece per character for medium and hard difficulties.
// Distractor pieces have isDistractor: true and a slotId that matches no slot.
const DISTRACTORS = {
  cat: { shapeType: 'square', colorKey: 'blue', label: 'Extra' },
  robot: { shapeType: 'triangle', colorKey: 'pink', label: 'Extra' },
  bird: { shapeType: 'square', colorKey: 'red', label: 'Extra' },
  monster: { shapeType: 'circle', colorKey: 'orange', label: 'Extra' },
  car: { shapeType: 'triangle', colorKey: 'purple', label: 'Extra' },
};

const FALLBACK_CHARACTER = CHARACTER_ITEMS[0];

export function getCharacterItem(characterId) {
  const id = characterId ?? FALLBACK_CHARACTER.id;
  const found = CHARACTER_ITEMS.find((c) => c.id === id);
  return found ?? FALLBACK_CHARACTER;
}

function normalizeDifficulty(difficulty) {
  if (difficulty === 'medium' || difficulty === 'hard') {
    return difficulty;
  }
  return 'easy';
}

export function getCharacterLayout(characterId, difficulty) {
  const id = characterId ?? FALLBACK_CHARACTER.id;
  const diff = normalizeDifficulty(difficulty);
  const byChar = CHARACTER_LAYOUTS?.[id] ?? CHARACTER_LAYOUTS.cat;
  const slots = byChar?.[diff] ?? byChar?.easy ?? [];
  // Always return a fresh copy so callers can't mutate static data.
  return slots.map((slot) => ({ ...slot }));
}

// Builds the draggable pieces for a character + difficulty.
// Real pieces map 1:1 to slots. Medium and Hard add one distractor.
export function getCharacterPieces(characterId, difficulty) {
  const id = characterId ?? FALLBACK_CHARACTER.id;
  const diff = normalizeDifficulty(difficulty);
  const slots = getCharacterLayout(id, diff);

  const pieces = slots.map((slot) => ({
    id: `piece_${slot.id}`,
    slotId: slot.id,
    shapeType: slot.shapeType,
    colorKey: slot.colorKey,
    label: slot.label,
    isDistractor: false,
  }));

  if (diff === 'medium' || diff === 'hard') {
    const d = DISTRACTORS?.[id] ?? DISTRACTORS.cat;
    pieces.push({
      id: `piece_${id}_distractor`,
      slotId: `${id}_distractor_slot`, // intentionally matches no real slot
      shapeType: d.shapeType,
      colorKey: d.colorKey,
      label: d.label,
      isDistractor: true,
    });
  }

  return pieces;
}
