import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export const useLogin = (navigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      // If successful, you typically navigate to a "Home" or "Dashboard" screen
      // For now, we'll just show an alert
      Alert.alert('Success', 'You are logged in!');
      // navigation.navigate('Home'); // Uncomment this when you have a Home screen
    }
    setLoading(false);
  };

  return {
    email, setEmail,
    password, setPassword,
    loading,
    handleLogin
  };
};