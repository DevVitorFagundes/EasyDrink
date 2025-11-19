import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DrinkCard } from '../../src/components/DrinkCard';
import { Header } from '../../src/components/Header';
import { Loading } from '../../src/components/Loading';
import { useAuth } from '../../src/contexts/AuthContext';
import { DrinkService } from '../../src/services/DrinkService';
import { colors, spacing } from '../../src/styles/theme';
import { Drink } from '../../src/types';

// Importa CSS apenas na web
if (Platform.OS === 'web') {
  require('./index.web.css');
}

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

  // Para web, renderiza com grid CSS flexível
  if (Platform.OS === 'web') {
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
          <View style={styles.contentWrapper}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Receitas em Destaque</Text>
              <Text style={styles.sectionSubtitle}>Descubra novos drinks deliciosos</Text>
            </View>

            <View 
              style={{
                ...styles.webGrid,
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
        </ScrollView>
      </View>
    );
  }

  // Para mobile nativo, mantém FlatList
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
  contentWrapper: {
    width: '100%',
    maxWidth: 1400,
    alignSelf: 'center',
  },
  section: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 24,
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
  webGrid: {
    width: '100%',
  },
  row: {
    justifyContent: 'space-between',
  },
});
