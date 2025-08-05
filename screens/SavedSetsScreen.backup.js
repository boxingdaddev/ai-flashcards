import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadSetsByFolder } from '../utils/storage';

export default function SavedSetsScreen() {
  const [savedSets, setSavedSets] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const folderName = route.params?.folder || "Default";

  useEffect(() => {
    const fetchSets = async () => {
      const sets = await loadSetsByFolder(folderName);
      setSavedSets(sets.reverse()); // newest first
    };

    const unsubscribe = navigation.addListener('focus', fetchSets);
    return unsubscribe;
  }, [navigation, folderName]);

  const handleNewSet = () => {
    navigation.navigate('Home'); // Go to Home to create a new set
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folderName} Sets</Text>

      <FlatList
        data={savedSets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleString()}</Text>
            <Text>{item.cards.length} cards</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No sets in this folder yet.</Text>}
      />

      {/* Floating "+" Button */}
      <TouchableOpacity style={styles.fab} onPress={handleNewSet}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#1E293B', // navy
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#FACC15', // gold
    fontSize: 28,
    fontWeight: 'bold',
  },
});
