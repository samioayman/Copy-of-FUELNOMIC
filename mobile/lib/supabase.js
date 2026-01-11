// mobile/lib/supabase.js
import 'react-native-url-polyfill/auto'; // The fix we installed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hekaaltbhoiepkiyghpj.supabase.co'; // Replace with your actual URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhla2FhbHRiaG9pZXBraXlnaHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NDEzOTksImV4cCI6MjA4MzUxNzM5OX0.8moAGtVJoZYklTtMmtiSXKKBoXjcAV2bRhRVoKiFuKE'; // Replace with your actual Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Configures Supabase to use phone storage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});