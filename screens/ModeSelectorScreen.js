import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ModeSelectorScreen({ navigation }) {
  const handleStudyMode = () => {
    navigation.replace("SavedFolders");
  };

  const handleLiveMode = () => {
    Alert.alert(
      "Live Mode Locked",
      "Live Mode is a premium feature and will be available soon!",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AI Flashcards</Text>
      <TouchableOpacity style={styles.button} onPress={handleStudyMode}>
        <Text style={styles.buttonText}>📖 Study Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.locked]}
        onPress={handleLiveMode}
      >
        <Text style={styles.buttonText}>🔒 Live Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  title: {
    fontSize: 28,
    color: "#FACC15",
    marginBottom: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FACC15",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  locked: {
    backgroundColor: "#9CA3AF",
  },
});
