import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createNewFolder, loadFolders, saveFlashcardSet } from '../utils/storage';

export default function SavedFoldersScreen() {
  const [folders, setFolders] = useState([]);
  const navigation = useNavigation();

  // Load folders on mount and whenever we come back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFolders();
    });
    fetchFolders();
    return unsubscribe;
  }, [navigation]);

  const fetchFolders = async () => {
    const data = await loadFolders();
    setFolders(data);
  };

  const handleAddFolder = async () => {
    const newFolderName = await createNewFolder();

    // Create a dummy set to ensure folder appears in storage
    const dummySet = {
      id: Date.now(),
      folder: newFolderName,
      title: `${newFolderName} (empty)`,
      cards: [],
      createdAt: new Date().toISOString(),
    };

    await saveFlashcardSet(dummySet);
    fetchFolders();
  };

  const handleFolderPress = (folderName) => {
    navigation.navigate('SavedSets', { folder: folderName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Folders</Text>

      <FlatList
        data={folders}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.folderCard}
            onPress={() => handleFolderPress(item)}
          >
            <Text style={styles.folderName}>{item}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No folders yet. Generate your first set!</Text>}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddFolder}>
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
  folderCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  folderName: {
    fontSize: 18,
    fontWeight: 'bold',
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
