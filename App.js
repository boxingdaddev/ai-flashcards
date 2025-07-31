import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Make sure these paths are correct after moving `app/` → `screens/`
import HomeScreen from './screens/HomeScreen';
import SavedSetsScreen from './screens/SavedSetsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1E293B' }, // navy header
          headerTintColor: '#FACC15', // gold text
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'AI Flashcards' }}
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
