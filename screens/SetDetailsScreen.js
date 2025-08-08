import { useState } from "react";
import {
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SetDetailsScreen({ route }) {
  const { set } = route.params;
  const [index, setIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);

  const cards = set.cards || [];
  const card = cards[index];

  const handleToggle = () => {
    setShowDefinition((prev) => !prev);
  };

  const goNext = () => {
    if (index < cards.length - 1) {
      setIndex((prev) => prev + 1);
      setShowDefinition(false);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        goNext();
      }
    },
  });

  if (!card) {
    return (
      <View style={styles.container}>
        <Text style={styles.cardText}>No cards in this set.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Pressable style={styles.frame} onPress={handleToggle}>
        <Text style={styles.kicker}>
          {showDefinition ? "Definition" : "Term"}
        </Text>
        <Text style={styles.cardText}>
          {showDefinition ? card.definition : card.term}
        </Text>
        <Text style={styles.counter}>
          {index + 1} of {cards.length}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    paddingTop: Platform.OS === "ios" ? 56 : 32,
    paddingBottom: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#111B2E",
    borderWidth: 1,
    borderColor: "#2B3A55",
    overflow: "hidden",
    padding: 24,
  },
  kicker: {
    position: "absolute",
    top: 12,
    fontSize: 13,
    color: "#93A3B8",
  },
  cardText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#E8EAF1",
  },
  counter: {
    position: "absolute",
    top: 12,
    right: 16,
    fontSize: 13,
    color: "#93A3B8",
  },
});
