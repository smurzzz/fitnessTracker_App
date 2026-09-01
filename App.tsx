import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
  Home: undefined;
  Details: { workoutId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <Text style={styles.subtitle}>Ready for your next workout.</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Details', { workoutId: 'strength-session' })}
      >
        <Text style={styles.buttonText}>View workout</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

function DetailsScreen({ route }: { route: { params: { workoutId: string } } }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout</Text>
      <Text style={styles.subtitle}>{route.params.workoutId}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f8ff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
