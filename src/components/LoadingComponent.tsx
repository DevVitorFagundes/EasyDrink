import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const LoadingComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ff6b6b" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});