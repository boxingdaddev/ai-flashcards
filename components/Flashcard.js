import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Flashcard({ term, definition }) {
  const [flipped, setFlipped] = React.useState(false);
  return (
    <TouchableOpacity style={styles.card} onPress={() => setFlipped(!flipped)}>
      <Text style={styles.text}>{flipped ? definition : term}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderColor: '#D4AF37',
    borderWidth: 2,
    borderRadius: 10,
    padding: 20,
    margin: 10,
    width: '80%',
    alignItems: 'center'
  },
  text: { color: '#f9f5e7', fontSize: 18, textAlign: 'center' }
});
