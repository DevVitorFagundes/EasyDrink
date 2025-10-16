import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { DrinkCard } from '../components/DrinkCard';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { DrinkService } from '../services/DrinkService';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../styles/theme';
import { Drink } from '../types';

interface Props {
  onDrinkPress?: (drinkId: string) => void;
}

export const SearchScreen: React.FC<Props> = ({ onDrinkPress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchDrinks = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Atenção', 'Digite o nome de um drink para buscar');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await DrinkService.searchDrinks(searchTerm.trim());
      setDrinks(results);
    } catch (error) {
      console.error('Error searching drinks:', error);
      Alert.alert('Erro', 'Erro ao buscar drinks');
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

  const renderDrinkCard = ({ item }: { item: Drink }) => (
    <DrinkCard
      drink={item}
      onPress={() => handleDrinkPress(item.idDrink)}
    />
  );

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Encontre seu drink ideal</Text>
          <Text style={styles.emptySubtitle}>Digite o nome de um drink para começar</Text>
        </View>
      );
    }

    if (drinks.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>😞</Text>
          <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
          <Text style={styles.emptySubtitle}>Tente buscar por outro termo</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Header title="Buscar Drinks" />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Digite o nome do drink..."
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={searchDrinks}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchDrinks}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Loading message="Buscando receitas..." />
        ) : (
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
        )}
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
  searchContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.card,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  listContainer: {
    flexGrow: 1,
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
  },
});