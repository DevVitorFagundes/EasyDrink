import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Loading } from '../components/Loading';
import { DrinkService } from '../services/DrinkService';
import { FavoritesService } from '../services/FavoritesService';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../styles/theme';
import { DrinkDetail, Ingredient } from '../types';

interface Props {
  drinkId: string;
  onGoBack?: () => void;
}

export const DrinkDetailScreen: React.FC<Props> = ({ drinkId, onGoBack }) => {
  const [drink, setDrink] = useState<DrinkDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadDrink = async () => {
      setIsLoading(true);
      try {
        const drinkData = await DrinkService.getDrinkById(drinkId);
        setDrink(drinkData);
      } catch (error) {
        console.error('Error loading drink:', error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do drink');
        if (onGoBack) {
          onGoBack();
        }
      } finally {
        setIsLoading(false);
      }
    };

    const checkIfFavorite = async () => {
      try {
        const favorite = await FavoritesService.isFavorite(drinkId);
        setIsFavorite(favorite);
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };

    loadDrink();
    checkIfFavorite();
  }, [drinkId, onGoBack]);

  const toggleFavorite = async () => {
    if (!drink) return;

    try {
      if (isFavorite) {
        await FavoritesService.removeFromFavorites(drinkId);
        setIsFavorite(false);
        Alert.alert('Removido', 'Drink removido dos favoritos');
      } else {
        await FavoritesService.addToFavorites(drink);
        setIsFavorite(true);
        Alert.alert('Adicionado', 'Drink adicionado aos favoritos');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos');
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
          measure: measure?.trim() || ""
        });
      }
    }
    return ingredients;
  };

  if (isLoading) {
    return <Loading message="Carregando receita..." />;
  }

  if (!drink) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Drink não encontrado</Text>
        <TouchableOpacity onPress={() => onGoBack && onGoBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ingredients = getIngredients();

  return (
    <ScrollView style={styles.container}>
      {/* Image and Favorite Button */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: drink.strDrinkThumb }} style={styles.image} />
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title and Info */}
        <View style={styles.header}>
          <Text style={styles.title}>{drink.strDrink}</Text>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{drink.strCategory}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{drink.strAlcoholic}</Text>
            </View>
            {drink.strGlass && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{drink.strGlass}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <View style={styles.ingredientsContainer}>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>• {ingredient.name}</Text>
                {ingredient.measure && (
                  <Text style={styles.ingredientMeasure}>{ingredient.measure}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          <Text style={styles.instructions}>{drink.strInstructions}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  ingredientsContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  ingredientName: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  ingredientMeasure: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  instructions: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.text,
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
});