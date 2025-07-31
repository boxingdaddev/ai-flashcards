import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@flashcard_sets';

export async function saveFlashcardSet(set) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = existing ? JSON.parse(existing) : [];
    parsed.push(set);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error("Error saving flashcard set:", error);
  }
}

export async function loadFlashcardSets() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error("Error loading flashcard sets:", error);
    return [];
  }
}
