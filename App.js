import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FlashCardScreen from "./screens/FlashCardScreen";
import ModeSelectorScreen from "./screens/ModeSelectorScreen";
import SavedFoldersScreen from "./screens/SavedFoldersScreen";
import SavedSetsScreen from "./screens/SavedSetsScreen";
import SetDetailsScreen from "./screens/SetDetailsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ModeSelector"
          screenOptions={{
            headerStyle: { backgroundColor: "#1E293B" },
            headerTintColor: "#FACC15",
            headerTitleStyle: { fontWeight: "bold" },
            headerBackTitleVisible: false,
            headerBackTitle: "", // ensure arrow-only back button
          }}
        >
          <Stack.Screen
            name="ModeSelector"
            component={ModeSelectorScreen}
            options={{ headerShown: false }} // fullscreen welcome screen
          />

          <Stack.Screen
            name="FlashCard"
            component={FlashCardScreen}
            options={{ title: "AI Flashcards" }}
          />
          <Stack.Screen
            name="SavedFolders"
            component={SavedFoldersScreen}
            options={{ title: "Folders" }}
          />
          <Stack.Screen
            name="SavedSets"
            component={SavedSetsScreen}
            options={{ title: "Saved Flashcards" }}
          />
          <Stack.Screen
            name="SetDetails"
            component={SetDetailsScreen}
            options={{ title: "Flashcards" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
