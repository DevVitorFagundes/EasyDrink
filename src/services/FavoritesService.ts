import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drink } from '../types';

const FAVORITES_KEY = 'favorites';

export class FavoritesService {
  static async getFavorites(): Promise<Drink[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static async addToFavorites(drink: Drink): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.idDrink === drink.idDrink);
      
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, drink];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  static async removeFromFavorites(drinkId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.idDrink !== drinkId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  static async isFavorite(drinkId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.idDrink === drinkId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }
}