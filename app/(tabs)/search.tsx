import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { DrinkCard } from '../../src/components/DrinkCard';
import { Header } from '../../src/components/Header';
import { Loading } from '../../src/components/Loading';
import { DrinkService } from '../../src/services/DrinkService';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../../src/styles/theme';
import { Drink } from '../../src/types';

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

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
    router.push(`/drink/${drinkId}`);
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
      <Header title="Buscar Drinks" subtitle="Encontre suas receitas favoritas" />

      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ex: Mojito, Caipirinha..."
            placeholderTextColor={colors.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={searchDrinks}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchDrinks}
          disabled={isLoading}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loading message="Buscando drinks..." />
      ) : Platform.OS === 'web' && drinks.length > 0 ? (
        <View style={styles.webContainer}>
          <View 
            style={{
              display: 'grid' as any,
              gridTemplateColumns: 'repeat(2, 1fr)' as any,
              gap: 16 as any,
              padding: 16,
            }}
            className="drinks-grid"
          >
            {drinks.map((drink) => (
              <DrinkCard
                key={drink.idDrink}
                drink={drink}
                onPress={() => handleDrinkPress(drink.idDrink)}
              />
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={drinks}
          renderItem={renderDrinkCard}
          keyExtractor={(item) => item.idDrink}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webContainer: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: fontSize.md,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
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
  },
});
