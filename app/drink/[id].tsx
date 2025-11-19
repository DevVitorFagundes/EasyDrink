import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { LoadingComponent } from '../../src/components/LoadingComponent';
import { DrinkService } from '../../src/services/DrinkService';
import { FavoritesService } from '../../src/services/FavoritesService';
import { colors } from '../../src/styles/theme';
import { DrinkDetail, Ingredient } from '../../src/types';

export default function DrinkDetailScreen() {
  const { id } = useLocalSearchParams();
  const [drink, setDrink] = useState<DrinkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadDrink(id);
      checkIfFavorite(id);
    }
  }, [id]);

  const loadDrink = async (drinkId: string) => {
    try {
      setLoading(true);
      const drinkData = await DrinkService.getDrinkById(drinkId);
      setDrink(drinkData);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar detalhes do drink');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async (drinkId: string) => {
    const favorite = await FavoritesService.isFavorite(drinkId);
    setIsFavorite(favorite);
  };

  const toggleFavorite = async () => {
    if (!drink) return;

    try {
      if (isFavorite) {
        await FavoritesService.removeFromFavorites(drink.idDrink);
        setIsFavorite(false);
      } else {
        await FavoritesService.addToFavorites(drink);
        setIsFavorite(true);
      }
    } catch {
      Alert.alert('Erro', 'Falha ao atualizar favoritos');
    }
  };

  const getIngredients = (): Ingredient[] => {
    if (!drink) return [];
    
    const ingredients: Ingredient[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || ''
        });
      }
    }
    return ingredients;
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (!drink) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Drink não encontrado</Text>
      </SafeAreaView>
    );
  }

  const ingredients = getIngredients();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: drink.strDrink,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { color: '#fff' }
        }} 
      />
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: drink.strDrinkThumb }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{drink.strDrink}</Text>
            <TouchableOpacity
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              onPress={toggleFavorite}
            >
              <Text style={styles.favoriteButtonText}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.category}>{drink.strCategory} • {drink.strAlcoholic}</Text>
          <Text style={styles.glass}>Servir em: {drink.strGlass}</Text>

          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient.measure} {ingredient.name}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          <Text style={styles.instructions}>{drink.strInstructions}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    marginRight: 10,
  },
  favoriteButton: {
    backgroundColor: colors.card,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: colors.error,
  },
  favoriteButtonText: {
    fontSize: 24,
    color: colors.white,
  },
  category: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  glass: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 20,
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    color: colors.white,
    lineHeight: 24,
  },
  errorText: {
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});