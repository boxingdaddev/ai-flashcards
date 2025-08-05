import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import HomeScreen from './screens/HomeScreen';
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
        // No folders yet → create Default and go straight to Home
        const defaultFolder = await createNewFolder();
        setInitialRoute({
          name: 'Home',
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
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute.name}
        screenOptions={{
          headerStyle: { backgroundColor: '#1E293B' },
          headerTintColor: '#FACC15',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitleVisible: false,
          headerBackTitleVisible: false,
          headerBackTitle: '', // force no text beside back arrow
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={initialRoute.params} // passes folder param to Home
          options={{ title: 'AI Flashcards' }}
        />
        <Stack.Screen
          name="SavedFolders"
          component={SavedFoldersScreen}
          options={{ title: 'Folders' }}
        />
        <Stack.Screen
          name="SetDetails"
          component={SetDetailsScreen}
          options={{ title: 'Set Details' }}
        />
        <Stack.Screen
          name="SavedSets"
          component={SavedSetsScreen}
          options={{ title: 'Saved Sets' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
