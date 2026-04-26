import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import SplashScreen from '@/components/loading/SplashScreen';

export default function Index() {
  const { user, loading } = useAuth();
  const [splashFinished, setSplashFinished] = useState(true);

  // 1. Show splash screen while loading
  if (loading || splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(false)} />;
  }

  // 2. If no user is found after loading, send to Login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // 3. If user exists, redirect based on their Laravel 'role'
  // Note: Adjust the 'role' strings to match your backend exactly
  switch (user.role) {
    case 'admin':
      return <Redirect href="/(admin)/dashboard" />;
    case 'staff':
      return <Redirect href="/(staff)/dashboard" />;
    case 'student':
      return <Redirect href="/(student)/dashboard" />;
    default:
      // Fallback if role is unknown
      return <Redirect href="/(auth)/login" />;
  }
}