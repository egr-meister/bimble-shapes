// Local stickers (learning progress markers only).
// Stickers have NO monetary value. No gambling-style or payment wording is used.

export const STICKER_ITEMS = [
  {
    id: 'sticker_cat_builder',
    title: 'Cat Builder Sticker',
    requirementText: 'Complete Cat once.',
    emoji: '🐱',
  },
  {
    id: 'sticker_robot_builder',
    title: 'Robot Builder Sticker',
    requirementText: 'Complete Robot once.',
    emoji: '🤖',
  },
  {
    id: 'sticker_bird_builder',
    title: 'Bird Builder Sticker',
    requirementText: 'Complete Bird once.',
    emoji: '🐦',
  },
  {
    id: 'sticker_monster_maker',
    title: 'Monster Maker Sticker',
    requirementText: 'Complete Little Monster once.',
    emoji: '👾',
  },
  {
    id: 'sticker_car_builder',
    title: 'Car Builder Sticker',
    requirementText: 'Complete Car once.',
    emoji: '🚗',
  },
  {
    id: 'sticker_shape_star',
    title: 'Bimble Shape Star',
    requirementText: 'Place 30 shapes in total.',
    emoji: '⭐',
  },
];

// Maps a character id to its builder sticker id.
const CHARACTER_STICKER = {
  cat: 'sticker_cat_builder',
  robot: 'sticker_robot_builder',
  bird: 'sticker_bird_builder',
  monster: 'sticker_monster_maker',
  car: 'sticker_car_builder',
};

// Returns the list of sticker ids that should be unlocked for the given stats.
export function getUnlockedStickers(stats) {
  const safeStats = stats ?? {};
  const byCharacter = safeStats?.byCharacter ?? {};
  const shapesPlaced = safeStats?.shapesPlaced ?? 0;

  const unlocked = [];

  Object.keys(CHARACTER_STICKER).forEach((charId) => {
    const completed = byCharacter?.[charId]?.completed ?? 0;
    if (completed > 0) {
      unlocked.push(CHARACTER_STICKER[charId]);
    }
  });

  if (shapesPlaced >= 30) {
    unlocked.push('sticker_shape_star');
  }

  return unlocked;
}
