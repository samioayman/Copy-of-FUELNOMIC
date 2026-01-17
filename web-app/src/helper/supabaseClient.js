import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hekaaltbhoiepkiyghpj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhla2FhbHRiaG9pZXBraXlnaHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NDEzOTksImV4cCI6MjA4MzUxNzM5OX0.8moAGtVJoZYklTtMmtiSXKKBoXjcAV2bRhRVoKiFuKE";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;