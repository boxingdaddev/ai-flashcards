import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function SetDetailsScreen({ route }) {
  const { set } = route.params; // full set object passed from SavedSetsScreen

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{set.title}</Text>
      <Text style={styles.subtitle}>
        {new Date(set.createdAt).toLocaleString()} • {set.cards.length} cards
      </Text>

      <FlatList
        data={set.cards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.term}>{item.term}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No cards in this set.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  term: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  definition: {
    fontSize: 16,
    marginTop: 5,
  },
});
