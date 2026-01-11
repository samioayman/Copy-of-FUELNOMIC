// mobile/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';

// Import your actual screen
import Register from './app/RegisterPage/Register';
import Login from './app/LoginPage/Login';
// Create a Placeholder Login Screen (So your app doesn't crash)
import Landing from './app/LandingPage/Landing';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">

        <Stack.Screen 
          name="Landing" 
          component={Landing} 
          options={{ headerShown: false }} // Hides the top bar for full immersion
        />
        
        {/* Screen 1: Your new Register Page */}
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ title: 'Create Account' }} 
        />

        {/* Screen 2: The placeholder Login Page */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#333' }
});
