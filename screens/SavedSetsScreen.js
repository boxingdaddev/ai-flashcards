import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadSetsByFolder } from '../utils/storage';

export default function SavedSetsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { folder } = route.params; // folder name passed from SavedFoldersScreen

  const [sets, setSets] = useState([]);

  const fetchSets = async () => {
    const data = await loadSetsByFolder(folder);
    setSets(data.reverse()); // newest first
  };

  // Auto-refresh whenever screen regains focus
  useFocusEffect(
    useCallback(() => {
      fetchSets();
    }, [folder])
  );

  const handleSetPress = (set) => {
    navigation.navigate('SetDetails', { set });
  };

  const handleAddSet = () => {
    navigation.navigate('FlashCard', { folder });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folder} Sets</Text>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSetPress(item)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDate}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
            <Text>{item.cards.length} cards</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No sets in this folder yet.</Text>}
      />

      {/* Floating + Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddSet}>
        <Text style={styles.addButtonText}>+</Text>
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
