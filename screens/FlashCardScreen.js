import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { generateFlashcardsFromText } from '../utils/ai';
import { clearAllSets, saveFlashcardSet } from '../utils/storage';

export default function FlashCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const folder = route.params?.folder || 'Default';

  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ensure back arrow is always visible on focus (fix disappearing issue)
  useFocusEffect(() => {
    navigation.setOptions({ headerBackVisible: true });
  });

  const handleGenerate = async () => {
    if (loading) return; // prevent double taps
    setLoading(true);

    const cards = await generateFlashcardsFromText(inputText);

    if (cards.length > 0) {
      const setToSave = {
        id: Date.now(),
        folder,
        title: inputText.substring(0, 30) || "Untitled",
        cards: cards,
        createdAt: new Date().toISOString()
      };
      await saveFlashcardSet(setToSave);
      setFlashcards(cards);
    }

    setLoading(false);
  };

  const handleClearStorage = async () => {
    await clearAllSets();
    alert('All flashcard data cleared!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Flashcards ({folder})</Text>

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

      {/* Debug: Clear all storage */}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Clear All Storage (Debug)"
          color="#B91C1C"
          onPress={handleClearStorage}
        />
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 120,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  result: {
    marginTop: 20,
  },
});
