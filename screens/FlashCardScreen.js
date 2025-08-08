import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useState } from "react";
import {
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { generateFlashcardsFromText } from "../utils/ai";
import {
  clearAllSets,
  clearTotalCardsGenerated,
  getTotalCardsGenerated,
  incrementTotalCardsGenerated,
  saveFlashcardSet,
} from "../utils/storage";

const CARD_LIMIT = 200;

export default function FlashCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const folder = route.params?.folder || "Default";

  const [inputText, setInputText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ headerBackVisible: true });
    }, [navigation])
  );

  const handleGenerate = async () => {
    if (loading) return;
    Keyboard.dismiss();
    setLoading(true);

    const totalCards = await getTotalCardsGenerated();
    if (totalCards >= CARD_LIMIT) {
      alert(
        "You've reached the 200-card limit for free users.\nUpgrade to unlock unlimited generation."
      );
      setLoading(false);
      return;
    }

    const cards = await generateFlashcardsFromText(inputText);

    if (cards.length > 0) {
      const setToSave = {
        id: Date.now(),
        folder,
        title: inputText.substring(0, 30) || "Untitled",
        cards,
        createdAt: new Date().toISOString(),
      };

      await saveFlashcardSet(setToSave);
      await incrementTotalCardsGenerated(cards.length);
      setFlashcards(cards);
      navigation.navigate("SetDetails", { set: setToSave });
    }

    setLoading(false);
  };

  const handleClearStorage = async () => {
    await clearAllSets();
    alert("All flashcard data cleared!");
  };

  const handleDevReset = async () => {
    await clearTotalCardsGenerated();
    const newValue = await getTotalCardsGenerated();
    console.log("💥 Reset value:", newValue); // should log 0
    alert("Dev counter reset!");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Generate Flashcards {"\n"} ({folder})
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Paste text or notes here..."
          multiline
          value={inputText}
          onChangeText={setInputText}
        />
        <Button
          title={loading ? "Generating..." : "Generate Flashcards"}
          onPress={handleGenerate}
          disabled={loading}
        />
        <View style={{ marginTop: 20 }}>
          <Button
            title="Clear All Storage (Debug)"
            color="#B91C1C"
            onPress={handleClearStorage}
          />
        </View>

        <TouchableOpacity onLongPress={handleDevReset}>
          <Text style={styles.devReset}>(Long press to reset dev counter)</Text>
        </TouchableOpacity>

        {flashcards.length > 0 && (
          <View style={styles.result}>
            {flashcards.map((card, index) => (
              <Text key={index}>
                {card.term} - {card.definition}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 120,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  result: {
    marginTop: 20,
  },
  devReset: {
    marginTop: 12,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});
