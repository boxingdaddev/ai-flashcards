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
import { deleteSet, loadSetsByFolder } from "../utils/storage";

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
    navigation.navigate("SetDetails", { set });
  };

  const handleAddSet = () => {
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
            setSets([...updatedSets]);
          },
        },
      ]
    );
  };

  const renderRightActions = (onPress) => (
    <TouchableOpacity style={styles.deleteButton} onPress={onPress}>
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => (
    <Swipeable
      renderRightActions={() =>
        renderRightActions(() => handleDeleteSet(folderName, item.id))
      }
    >
      <TouchableOpacity onPress={() => handleSetPress(item)}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
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
  index: {
    marginRight: 10,
    fontWeight: "bold",
  },
  titleText: {
    fontSize: 16,
    flexShrink: 1,
  },
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
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  cardCountPill: {
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
    alignSelf: "center",
  },
  cardCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
  },
});
