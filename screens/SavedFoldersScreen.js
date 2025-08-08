import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import {
  createNewFolder,
  deleteFolder,
  getTotalCardsGenerated,
  loadFolders,
  saveFlashcardSet,
} from "../utils/storage";

export default function SavedFoldersScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [folders, setFolders] = useState([]);
  const [usageCount, setUsageCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchFolders();
      fetchUsageCount();
    });
    fetchFolders();
    fetchUsageCount();
    return unsubscribe;
  }, [navigation]);

  const fetchFolders = async () => {
    const data = await loadFolders();
    setFolders(data);
  };

  const fetchUsageCount = async () => {
    const count = await getTotalCardsGenerated();
    console.log("📊 Usage count fetched in Folders:", count);
    setUsageCount(count);
  };

  const handleAddFolder = async () => {
    const newFolderName = await createNewFolder();

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
    navigation.navigate("SavedSets", { folder: folderName });
  };

  const handleDeleteFolder = (folderName) => {
    Alert.alert(
      "Delete Folder?",
      "This will remove the folder and all sets inside.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteFolder(folderName);
            const updatedFolders = await loadFolders();
            setFolders([...updatedFolders]); // refresh UI
          },
        },
      ]
    );
  };

  const renderRightActions = (onPress) => (
    <TouchableOpacity
      style={{
        width: "25%",
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Folders</Text>
        <Text style={styles.usage}>{usageCount}/200</Text>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={folders}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() =>
              renderRightActions(() => handleDeleteFolder(item))
            }
          >
            <TouchableOpacity onPress={() => handleFolderPress(item)}>
              <View style={styles.row}>
                <Text>{item}</Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
        ListEmptyComponent={
          <Text>No folders yet. Generate your first set!</Text>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddFolder}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  usage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
    alignSelf: "center",
  },
  folderCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  folderName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
});
