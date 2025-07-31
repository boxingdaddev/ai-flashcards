import { OPENAI_API_KEY } from '@env';
import { StyleSheet, Text, View } from 'react-native';

console.log("Loaded API Key:", OPENAI_API_KEY);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen (AI Flashcards)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
