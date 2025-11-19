import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import React from "react";
import {AuthProvider} from "../src/contexts/AuthContext";
import {colors} from "../src/styles/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <AuthProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen
            name="drink/[id]"
            options={{
              headerShown: true,
              title: "Detalhes do Drink",
              headerBackTitle: "Voltar",
              headerStyle: {backgroundColor: colors.background},
              headerTintColor: colors.white,
            }}
          />
        </Stack>
      </AuthProvider>
    </>
  );
}
