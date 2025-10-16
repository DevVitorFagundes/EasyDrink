import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DrinkCard } from '../components/DrinkCard';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { FavoritesService } from '../services/FavoritesService';
import { colors, fontSize, fontWeight, spacing } from '../styles/theme';
import { Drink } from '../types';

interface Props {
  onDrinkPress?: (drinkId: string) => void;
  onSearchPress?: () => void;
}

export const FavoritesScreen: React.FC<Props> = ({ onDrinkPress, onSearchPress }) => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadFavorites();
  }, []);

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

  const handleDrinkPress = (drinkId: string) => {
    if (onDrinkPress) {
      onDrinkPress(drinkId);
    } else {
      console.log('Drink selected:', drinkId);
    }
  };

  const navigateToSearch = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      console.log('Navigate to search');
    }
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
        title="Favoritos"
        subtitle={`${drinks.length} ${drinks.length === 1 ? 'receita salva' : 'receitas salvas'}`}
      />

      <View style={styles.content}>
        <FlatList
          data={drinks}
          renderItem={renderDrinkCard}
          keyExtractor={(item) => item.idDrink}
          numColumns={2}
          columnWrapperStyle={drinks.length > 1 ? styles.row : undefined}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  listContainer: {
    flexGrow: 1,
    paddingTop: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  discoverButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  discoverButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.white,
  },
});