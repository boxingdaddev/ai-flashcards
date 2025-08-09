import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useState } from "react";
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
  deleteSet,
  getAllSetNamesInFolder,
  loadSetsByFolder,
  renameSet as storageRenameSet,
} from "../utils/storage";

export default function SavedSetsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { folder: folderName } = route.params;
  const folder = folderName;

  const [sets, setSets] = useState([]);

  // Rename modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInitial, setModalInitial] = useState("");
  const [renameTarget, setRenameTarget] = useState(null); // { id, title }

  const fetchSets = async () => {
    const data = await loadSetsByFolder(folder);
    setSets(data.slice().reverse()); // newest first
  };

  useFocusEffect(
    useCallback(() => {
      fetchSets();
    }, [folder])
  );

  const handleSetPress = (set) => {
    // Keep your existing route; change to 'FlashCards' if that’s your new study screen
    navigation.navigate("SetDetails", { set });
  };

  const handleAddSet = () => {
    // If your generator route is 'FlashCard' keep it; otherwise update to 'AIGenerate'
    navigation.navigate("FlashCard", { folder });
  };

  const handleDeleteSet = (folderName, setId) => {
    Alert.alert(
      "Delete Set?",
      "Are you sure you want to delete this flashcard set?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteSet(folderName, setId);
            const updatedSets = await loadSetsByFolder(folderName);
            setSets(updatedSets.slice().reverse());
          },
        },
      ]
    );
  };

  // --- Rename flow ---
  const openRename = (item) => {
    setRenameTarget({ id: item.id, title: item.title });
    setModalInitial(item.title);
    setModalVisible(true);
  };

  const closeRename = () => {
    setModalVisible(false);
    setRenameTarget(null);
    setModalInitial("");
  };

  const confirmRename = async (text) => {
    const input = normalizeSpace(text);
    if (!renameTarget) return closeRename();

    // Collision-safe within this folder
    const existingTitles = await getAllSetNamesInFolder(
      folder,
      renameTarget.id
    );
    const safe = getNextAvailableName(
      input || renameTarget.title,
      existingTitles
    );

    if (safe !== renameTarget.title) {
      await storageRenameSet(renameTarget.id, safe);
      await fetchSets();
    }
    closeRename();
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

  const renderItem = ({ item, index }) => (
    <Swipeable
      renderRightActions={() =>
        renderRightActions(
          () => handleDeleteSet(folderName, item.id),
          () => openRename(item)
        )
      }
    >
      <TouchableOpacity
        onPress={() => handleSetPress(item)}
        onLongPress={() => openRename(item)}
      >
        <View style={styles.row}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Text style={styles.index}>{index + 1}.</Text>
            <Text style={styles.titleText}>{item.title}</Text>
          </View>
          <View style={styles.cardCountPill}>
            <Text style={styles.cardCountText}>{item.cards.length} cards</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const totalCards = sets.reduce((sum, set) => sum + set.cards.length, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folder} - Sets</Text>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListFooterComponent={() =>
          sets.length > 0 ? (
            <Text style={styles.totalCounter}>
              Total Cards in All Sets: {totalCards}
            </Text>
          ) : null
        }
        ListEmptyComponent={<Text>No sets in this folder yet.</Text>}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddSet}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <RenameModal
        visible={modalVisible}
        title="Rename Set"
        message="Enter a new name for this set:"
        initialValue={modalInitial}
        onCancel={closeRename}
        onConfirm={confirmRename}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    justifyContent: "space-between",
  },
  index: { marginRight: 10, fontWeight: "bold" },
  titleText: { fontSize: 16, flexShrink: 1 },
  totalCounter: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  deleteButton: {
    width: "25%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
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
  cardCountPill: {
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
    alignSelf: "center",
  },
  cardCountText: { fontSize: 12, fontWeight: "600", color: "#1e293b" },
});
