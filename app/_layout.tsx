import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext'; 
import SplashScreen from '@/components/loading/SplashScreen';

import '../global.css';

export default function RootLayout() {
  return (
    // 1. Wrap EVERYTHING in AuthProvider first
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
      if (loading) return;

      const inAuthGroup = segments[0] === '(auth)';
      const inStudentGroup = segments[0] === '(student)';
      const inStaffGroup = segments[0] === '(staff)';
      const inAdminGroup = segments[0] === '(admin)';
      const isDeepLink = segments[0] === undefined && !user;

      // Already in correct group — do nothing
      if (user && (inStudentGroup || inStaffGroup || inAdminGroup)) return;

      if (!user && !inAuthGroup && !isDeepLink) {
          router.replace('/(auth)/login');
      } else if (user && inAuthGroup) {
          router.replace('/'); // index handles role routing
      }
  }, [user, loading, segments]);

  if (loading || !splashFinished) {
      return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  return (
      <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(student)" options={{ headerShown: false }} />
          <Stack.Screen name="(staff)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack>
  );
}