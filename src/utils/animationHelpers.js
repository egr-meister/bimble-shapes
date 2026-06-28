// Simple Animated config helpers. No heavy libraries, no flashing, no stress.
// All values are plain objects safe to pass into Animated.timing / spring.

export function getPlaceAnimationConfig() {
  // Soft "settle into place" pop.
  return {
    toValue: 1,
    friction: 6,
    tension: 80,
    useNativeDriver: true,
  };
}

export function getCompletionAnimationConfig() {
  // Gentle scale + fade for the completion panel.
  return {
    scale: {
      toValue: 1,
      friction: 5,
      tension: 70,
      useNativeDriver: true,
    },
    opacity: {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    },
  };
}

export function getShapeFoundAnimationConfig() {
  // Small calm bounce when a shape is found in Find Shape mode.
  return {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  };
}
