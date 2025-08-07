import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlashCardScreen from './screens/FlashCardScreen';
import SavedFoldersScreen from './screens/SavedFoldersScreen';
import SavedSetsScreen from './screens/SavedSetsScreen';
import SetDetailsScreen from './screens/SetDetailsScreen';

import { createNewFolder, loadFolders } from './utils/storage';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const init = async () => {
      const folders = await loadFolders();

      if (folders.length === 0) {
        // No folders yet → create Default and go straight to FlashCard screen
        const defaultFolder = await createNewFolder();
        setInitialRoute({
          name: 'FlashCard', // changed from 'Home'
          params: { folder: defaultFolder },
        });
      } else {
        // Folders exist → start on folder list
        setInitialRoute({ name: 'SavedFolders' });
      }
    };

    init();
  }, []);

  // Avoid rendering navigator until initial route is decided
  if (!initialRoute) return null;

  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute.name}
        screenOptions={{
          headerStyle: { backgroundColor: '#1E293B' },
          headerTintColor: '#FACC15',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitleVisible: false,
          headerBackTitle: '', // ensure arrow-only back button
        }}
      >
        <Stack.Screen
          name="FlashCard"
          component={FlashCardScreen}
          initialParams={initialRoute.params}
          options={{ title: 'AI Flashcards' }}
        />
        <Stack.Screen
          name="SavedFolders"
          component={SavedFoldersScreen}
          options={{ title: 'Folders' }}
        />
        <Stack.Screen
          name="SavedSets"
          component={SavedSetsScreen}
          options={{ title: 'Saved Sets' }}
        />
        <Stack.Screen
          name="SetDetails"
          component={SetDetailsScreen}
          options={{ title: 'Set Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </GestureHandlerRootView>
);
}
