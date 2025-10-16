import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="drink/[id]" options={{ 
            headerShown: true,
            title: "Detalhes do Drink",
            headerStyle: { backgroundColor: '#8B5CF6' },
            headerTintColor: '#fff',
          }} />
        </Stack>
      </AuthProvider>
    </>
  );
}
