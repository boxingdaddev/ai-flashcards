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
