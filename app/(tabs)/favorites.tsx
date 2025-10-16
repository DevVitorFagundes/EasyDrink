import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DrinkCard } from '../../src/components/DrinkCard';
import { Header } from '../../src/components/Header';
import { Loading } from '../../src/components/Loading';
import { FavoritesService } from '../../src/services/FavoritesService';
import { colors, fontSize, fontWeight, spacing } from '../../src/styles/theme';
import { Drink } from '../../src/types';

export default function FavoritesScreen() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const favorites = await FavoritesService.getFavorites();
      setDrinks(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleDrinkPress = (drinkId: string) => {
    router.push(`/drink/${drinkId}`);
  };

  const navigateToSearch = () => {
    router.push('/(tabs)/search');
  };

  const renderDrinkCard = ({ item }: { item: Drink }) => (
    <DrinkCard
      drink={item}
      onPress={() => handleDrinkPress(item.idDrink)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>❤️</Text>
      <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
      <Text style={styles.emptySubtitle}>
        Comece explorando receitas e salvando suas favoritas
      </Text>
      <TouchableOpacity style={styles.discoverButton} onPress={navigateToSearch}>
        <Text style={styles.discoverButtonText}>Descobrir receitas</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <Loading message="Carregando favoritos..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Meus Favoritos"
        subtitle={drinks.length > 0 ? `${drinks.length} drinks salvos` : 'Suas receitas favoritas'}
      />

      <FlatList
        data={drinks}
        renderItem={renderDrinkCard}
        keyExtractor={(item) => item.idDrink}
        numColumns={2}
        columnWrapperStyle={drinks.length > 0 ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  discoverButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 25,
  },
  discoverButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
