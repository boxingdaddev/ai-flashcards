import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteSet, loadSetsByFolder } from '../utils/storage';

export default function SavedSetsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { folder: folderName } = route.params;
  const folder = folderName;

  const [sets, setSets] = useState([]);

  const fetchSets = async () => {
    const data = await loadSetsByFolder(folder);
    setSets(data.reverse()); // newest first
  };

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

  const handleDeleteSet = (folderName, setId) => {
    Alert.alert(
      'Delete Set?',
      'Are you sure you want to delete this flashcard set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSet(folderName, setId);
            const updatedSets = await loadSetsByFolder(folderName);
            setSets([...updatedSets]); // ✅ force update
          },
        },
      ]
    );
  };

  const renderRightActions = (onPress) => (
    <TouchableOpacity
      style={{
        width: '25%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folder} Sets</Text>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() =>
              renderRightActions(() => handleDeleteSet(folderName, item.id))
            }
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('SetDetails', { set: item })}
            >
              <View style={styles.row}>
                <Text>{item.title}</Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
        ListEmptyComponent={<Text>No sets in this folder yet.</Text>}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddSet}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
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
