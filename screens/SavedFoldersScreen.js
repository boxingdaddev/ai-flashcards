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

import RenameModal from "../components/RenameModal";
import { getNextAvailableName, normalizeSpace } from "../utils/naming.js";

import {
  deleteFolder,
  getAllFolderNamesExcluding,
  getNextDefaultFolderName,
  getTotalCardsGenerated,
  loadFolders,
  saveFlashcardSet,
  renameFolder as storageRenameFolder,
} from "../utils/storage";

export default function SavedFoldersScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [folders, setFolders] = useState([]);
  const [usageCount, setUsageCount] = useState(0);
  const navigation = useNavigation();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalInitial, setModalInitial] = useState("");
  const [modalMode, setModalMode] = useState(null); // "create" | "rename"
  const [renameTarget, setRenameTarget] = useState(null); // oldName for rename

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      fetchFolders();
      fetchUsageCount();
    });
    fetchFolders();
    fetchUsageCount();
    return unsub;
  }, [navigation]);

  const fetchFolders = async () => {
    const data = await loadFolders();
    setFolders(data);
  };

  const fetchUsageCount = async () => {
    const count = await getTotalCardsGenerated();
    setUsageCount(count);
  };

  // --- Add Folder flow ---
  const handleAddFolder = async () => {
    const suggestion = await getNextDefaultFolderName();
    setModalTitle("Create Folder");
    setModalMessage("Name your folder:");
    setModalInitial(suggestion);
    setModalMode("create");
    setRenameTarget(null);
    setModalVisible(true);
  };

  // --- Rename Folder flow ---
  const handleRenameFolder = async (oldName) => {
    setModalTitle("Rename Folder");
    setModalMessage(`Rename "${oldName}" to:`);
    setModalInitial(oldName);
    setModalMode("rename");
    setRenameTarget(oldName);
    setModalVisible(true);
  };

  const onModalCancel = () => {
    setModalVisible(false);
  };

  const onModalConfirm = async (text) => {
    const input = normalizeSpace(text);
    setModalVisible(false);

    if (modalMode === "create") {
      const existing = await loadFolders();
      const base = input || (await getNextDefaultFolderName());
      const name = getNextAvailableName(base, existing);

      // Create placeholder set so folder appears
      const dummySet = {
        id: Date.now(),
        folder: name,
        title: `${name} (empty)`,
        cards: [],
        createdAt: new Date().toISOString(),
      };
      await saveFlashcardSet(dummySet);
      fetchFolders();
      return;
    }

    if (modalMode === "rename" && renameTarget) {
      const existing = await getAllFolderNamesExcluding(renameTarget);
      const safe = getNextAvailableName(input || renameTarget, existing);
      if (safe !== renameTarget) {
        await storageRenameFolder(renameTarget, safe);
        fetchFolders();
      }
    }
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
            fetchFolders();
          },
        },
      ]
    );
  };

  const renderRightActions = (onDelete, onRename) => (
    <View style={{ flexDirection: "row", width: "40%" }}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "#64748b",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onRename}
      >
        <Ionicons name="create-outline" size={22} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onDelete}
      >
        <Ionicons name="trash-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
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
              renderRightActions(
                () => handleDeleteFolder(item),
                () => handleRenameFolder(item)
              )
            }
          >
            <TouchableOpacity
              onPress={() => handleFolderPress(item)}
              onLongPress={() => handleRenameFolder(item)}
            >
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

      <RenameModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        initialValue={modalInitial}
        onCancel={onModalCancel}
        onConfirm={onModalConfirm}
      />
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  usage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
    alignSelf: "center",
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
  addButtonText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
});
