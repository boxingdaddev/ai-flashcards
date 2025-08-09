import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import FlashCardScreen from "./screens/FlashCardScreen";
import ModeSelectorScreen from "./screens/ModeSelectorScreen";
import SavedFoldersScreen from "./screens/SavedFoldersScreen";
import SavedSetsScreen from "./screens/SavedSetsScreen";
import SetDetailsScreen from "./screens/SetDetailsScreen";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const Stack = createStackNavigator();

export default function App() {
  const scheme = useColorScheme() ?? "light";
  const BG =
    scheme === "dark" ? Colors.dark.background : Colors.light.background;
  const SAFE = scheme === "dark" ? Colors.dark.safeArea : Colors.light.safeArea;

  const navTheme = scheme === "dark" ? { ...DarkTheme } : { ...DefaultTheme };
  navTheme.colors = { ...navTheme.colors, background: BG };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        translucent={false}
        backgroundColor={SAFE}
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
      />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          initialRouteName="ModeSelector"
          screenOptions={{
            headerStyle: { backgroundColor: "#1E293B" },
            headerTintColor: "#FACC15",
            headerTitleStyle: { fontWeight: "bold" },
            headerBackTitleVisible: false,
            headerBackTitle: "",
            // For @react-navigation/stack, cardStyle controls the screen background
            cardStyle: { backgroundColor: BG },
          }}
        >
          <Stack.Screen
            name="ModeSelector"
            component={ModeSelectorScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="FlashCard"
            component={FlashCardScreen}
            options={{ title: "Generate Flashcards" }}
          />
          <Stack.Screen
            name="SavedFolders"
            component={SavedFoldersScreen}
            options={{ title: "Folders" }}
          />
          <Stack.Screen
            name="SavedSets"
            component={SavedSetsScreen}
            options={{ title: "Saved Flashcard Sets" }}
          />
          <Stack.Screen
            name="SetDetails"
            component={SetDetailsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
