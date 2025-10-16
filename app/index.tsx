import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DrinkCard } from '../src/components/DrinkCard';
import { Header } from '../src/components/Header';
import { Loading } from '../src/components/Loading';
import { useAuth } from '../src/contexts/AuthContext';
import { DrinkService } from '../src/services/DrinkService';
import { colors, spacing } from '../src/styles/theme';
import { Drink } from '../src/types';

export default function HomeScreen() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    setIsLoading(true);
    try {
      const randomDrinks = await DrinkService.getRandomDrinks(12);
      setDrinks(randomDrinks);
    } catch (error) {
      console.error('Error fetching drinks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDrinks();
    setRefreshing(false);
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

  if (isLoading && !refreshing) {
    return <Loading message="Carregando receitas..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Easy Drink"
        subtitle={`Olá, ${user?.name || 'Usuário'}!`}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receitas em Destaque</Text>
          <Text style={styles.sectionSubtitle}>Descubra novos drinks deliciosos</Text>
        </View>

        <View style={styles.drinksContainer}>
          <FlatList
            data={drinks}
            renderItem={renderDrinkCard}
            keyExtractor={(item) => item.idDrink}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  drinksContainer: {
    paddingHorizontal: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
  },
});
