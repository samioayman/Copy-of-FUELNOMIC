import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useLogin } from '../LoginPage/useLogin';
import { styles } from '../LoginPage/Styles';

export default function Login({ navigation }) {
  const {
    email, setEmail,
    password, setPassword,
    loading,
    handleLogin
  } = useLogin(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>

      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
        style={styles.input} 
      />
      
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Log In'}</Text>
      </TouchableOpacity>

      {/* Link to Register if they don't have an account */}
      <TouchableOpacity 
        style={styles.linkContainer} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}