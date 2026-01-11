import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Landing({ navigation }) {
  return (
    <View style={styles.container}>
      {/* 1. Background Image */}
      {/* Make sure you have the image in your assets folder! */}
      <ImageBackground 
        source={require('../../assets/images/landing-bg.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        {/* 2. Gradient Overlay (The "Orange Fade" effect) */}
        <LinearGradient
          // Colors: Transparent at top -> Orange -> Dark Red at bottom
          colors={['transparent', 'rgba(255, 100, 50, 0.8)', '#c0392b']}
          style={styles.gradient}
          locations={[0.4, 0.8, 1]} // Adjusts where the fade starts
        >
          
          {/* 3. Text Content */}
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
               {/* You can add a small logo icon here if you want */}
            </View>
            
            <Text style={styles.title}>Fuelnomic</Text>
            <Text style={styles.subtitle}>
              A real time fuel tracing app with monthly analysis and BUDI 95 incorporated
            </Text>

            {/* 4. Get Started Button */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
          
        </LinearGradient>
      </ImageBackground>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes content to the bottom
    padding: 20,
    paddingBottom: 50,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#eee',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    maxWidth: '80%',
  },
  button: {
    backgroundColor: '#005b8e', // That nice dark blue from your design
    paddingVertical: 18,
    paddingHorizontal: 60, // Wide button
    borderRadius: 30, // Fully rounded edges
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});