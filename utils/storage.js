// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@flashcard_sets';

/**
 * Save a new flashcard set
 * Each set: { id, folder, title, cards[], createdAt }
 */
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

/**
 * Load all flashcard sets
 */
export async function loadFlashcardSets() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error("Error loading flashcard sets:", error);
    return [];
  }
}

/**
 * Load sets by folder name
 */
export async function loadSetsByFolder(folderName) {
  try {
    const allSets = await loadFlashcardSets();
    return allSets.filter(set => set.folder === folderName);
  } catch (error) {
    console.error("Error loading sets by folder:", error);
    return [];
  }
}

/**
 * Get unique folder names
 */
export async function loadFolders() {
  try {
    const allSets = await loadFlashcardSets();
    const folders = [...new Set(allSets.map(set => set.folder || "Default"))];
    return folders;
  } catch (error) {
    console.error("Error loading folders:", error);
    return [];
  }
}

/**
 * Auto-create new folder name
 * Default, Default 2, Default 3...
 */
export async function createNewFolder() {
  const folders = await loadFolders();

  // If no folders exist, create "Default"
  if (folders.length === 0) {
    return "Default";
  }

  // Extract numeric suffixes from existing "Default X"
  const defaultFolders = folders
    .filter(f => f.startsWith("Default"))
    .map(f => {
      const match = f.match(/Default (\d+)/);
      return match ? parseInt(match[1]) : 1;
    });

  // Find next available number
  const nextNumber = defaultFolders.length > 0
    ? Math.max(...defaultFolders) + 1
    : 2;

  return `Default ${nextNumber}`;
}

/**
 * Clear all flashcard sets (for dev/debug)
 */
export async function clearAllSets() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("All flashcard sets cleared");
  } catch (error) {
    console.error("Error clearing flashcard sets:", error);
  }
}
