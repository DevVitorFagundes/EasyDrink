import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FavoritesService } from '../services/FavoritesService';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../styles/theme';
import { Drink } from '../types';

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2; // 2 colunas com espaçamento

interface DrinkCardProps {
  drink: Drink;
  onPress: () => void;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({ drink, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      const favorite = await FavoritesService.isFavorite(drink.idDrink);
      setIsFavorite(favorite);
    };
    
    checkIfFavorite();
  }, [drink.idDrink]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      await FavoritesService.removeFromFavorites(drink.idDrink);
      setIsFavorite(false);
    } else {
      await FavoritesService.addToFavorites(drink);
      setIsFavorite(true);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: drink.strDrinkThumb }} style={styles.image} />
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {drink.strDrink}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {drink.strCategory}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === 'web' ? '100%' : cardWidth,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: Platform.OS === 'web' ? 0 : spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: Platform.OS === 'web' ? 180 : 120,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
  },
  content: {
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  category: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});