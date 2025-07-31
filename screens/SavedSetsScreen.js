import { StyleSheet, Text, View } from 'react-native';

export default function SavedSetsScreen() {
  return (
    <View style={styles.container}>
      <Text>Saved Sets Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
