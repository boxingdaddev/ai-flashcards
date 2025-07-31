import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { generateFlashcardsFromText } from '../utils/ai';

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);

  const handleGenerate = async () => {
    const cards = await generateFlashcardsFromText(inputText);
    console.log("Generated flashcards:", cards);
    setFlashcards(cards);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Flashcards</Text>

      <TextInput
        style={styles.input}
        placeholder="Paste text or notes here..."
        multiline
        value={inputText}
        onChangeText={setInputText}
      />

      <Button title="Generate Flashcards" onPress={handleGenerate} />

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
