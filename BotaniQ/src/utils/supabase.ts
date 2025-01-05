import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";

export const supabase = createClient("https://qbxxyoegcnsfucrpuhav.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieHh5b2VnY25zZnVjcnB1aGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MDcwNDksImV4cCI6MjA1MTM4MzA0OX0.-TQvUOn_IKJ9QAsTNQeZMOvgfiuxlx4_wWixLkrFg5A", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
