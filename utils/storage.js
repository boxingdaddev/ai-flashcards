import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@flashcard_sets";
const CARD_COUNT_KEY = "@total_cards_generated";

/**
 * Save a new flashcard set
 * Each set: { id, folder, title, cards[], createdAt }
 * - NO card count logic here (handled in FlashCardScreen)
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

export async function loadFlashcardSets() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error("Error loading flashcard sets:", error);
    return [];
  }
}

export async function loadSetsByFolder(folderName) {
  try {
    const allSets = await loadFlashcardSets();
    return allSets.filter((set) => set.folder === folderName);
  } catch (error) {
    console.error("Error loading sets by folder:", error);
    return [];
  }
}

export async function loadFolders() {
  try {
    const allSets = await loadFlashcardSets();
    const folderSet = new Set(allSets.map((set) => set.folder || "Default"));
    if (folderSet.size === 0) folderSet.add("Default");
    return Array.from(folderSet);
  } catch (error) {
    console.error("Error loading folders:", error);
    return ["Default"];
  }
}

export async function createNewFolder() {
  const folders = await loadFolders();
  if (folders.length === 0) return "Default";

  const defaultFolders = folders
    .filter((f) => f.startsWith("Default"))
    .map((f) => {
      const match = f.match(/Default (\d+)/);
      return match ? parseInt(match[1]) : 1;
    });

  const nextNumber =
    defaultFolders.length > 0 ? Math.max(...defaultFolders) + 1 : 2;

  return `Default ${nextNumber}`;
}

export async function clearAllSets() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("All flashcard sets cleared");
  } catch (error) {
    console.error("Error clearing flashcard sets:", error);
  }
}

async function saveAllSets(sets) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
  } catch (error) {
    console.error("Error saving sets:", error);
  }
}

export const deleteFolder = async (folderName) => {
  try {
    const allSets = await loadFlashcardSets();
    const updatedSets = allSets.filter((set) => set.folder !== folderName);
    await saveAllSets(updatedSets);
  } catch (error) {
    console.error("Error deleting folder:", error);
  }
};

export const deleteSet = async (folderName, setId) => {
  try {
    const allSets = await loadFlashcardSets();
    const updatedSets = allSets.filter(
      (set) => !(set.folder === folderName && set.id === setId)
    );
    await saveAllSets(updatedSets);
  } catch (error) {
    console.error("Error deleting set:", error);
  }
};

export async function getAllFolderNamesExcluding(excludedFolder) {
  const folders = await loadFolders();
  return folders.filter((f) => f !== excludedFolder);
}

// rename folder by updating all sets with that folder name
export async function renameFolder(oldName, newName) {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const sets = raw ? JSON.parse(raw) : [];
  const updated = sets.map((s) =>
    s.folder === oldName ? { ...s, folder: newName } : s
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function getNextDefaultFolderName() {
  const folders = await loadFolders();
  if (folders.length === 0) return "Default";
  const nums = folders
    .filter((f) => f.startsWith("Default"))
    .map((f) => {
      const m = f.match(/Default (\d+)/);
      return m ? parseInt(m[1], 10) : 1;
    });
  const next = nums.length ? Math.max(...nums) + 1 : 2;
  return `Default ${next}`;
}

export async function getTotalCardsGenerated() {
  try {
    const stored = await AsyncStorage.getItem(CARD_COUNT_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error("Error getting card count:", error);
    return 0;
  }
}

export async function clearTotalCardsGenerated() {
  try {
    await AsyncStorage.removeItem(CARD_COUNT_KEY);
    console.log("Total card generation counter reset.");
  } catch (error) {
    console.error("Error clearing total card counter:", error);
  }
}

export async function incrementTotalCardsGenerated(amount) {
  try {
    const current = await getTotalCardsGenerated();
    const updated = current + amount;
    await AsyncStorage.setItem(CARD_COUNT_KEY, updated.toString());
  } catch (error) {
    console.error("Error incrementing card count:", error);
  }
}

export async function clearCardCounter() {
  try {
    await AsyncStorage.removeItem(CARD_COUNT_KEY);
    console.log("Card counter cleared");
  } catch (error) {
    console.error("Error clearing card counter:", error);
  }
}

/* =========================================================
 *                  NEW: SET HELPERS
 * =======================================================*/

// Get all set titles in a folder (for collision-safe naming)
// excludeSetId is optional; pass the set being renamed to avoid
// treating its current title as a collision.
export async function getAllSetNamesInFolder(folderName, excludeSetId = null) {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const sets = raw ? JSON.parse(raw) : [];
    return sets
      .filter((s) => s.folder === folderName && s.id !== excludeSetId)
      .map((s) => s.title);
  } catch (e) {
    console.error("Error getting set names in folder:", e);
    return [];
  }
}

// Rename a single set by id; returns the updated set
export async function renameSet(setId, newTitle) {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const sets = raw ? JSON.parse(raw) : [];
    const updated = sets.map((s) =>
      s.id === setId ? { ...s, title: newTitle } : s
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find((s) => s.id === setId);
  } catch (e) {
    console.error("Error renaming set:", e);
    return null;
  }
}
