import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { Drink } from '../types';

export class FavoritesService {
  private static getUserId(): string {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return userId;
  }

  private static getFavoritesKey(): string {
    const userId = this.getUserId();
    return `favorites_${userId}`;
  }

  static async getFavorites(): Promise<Drink[]> {
    try {
      const key = this.getFavoritesKey();
      const favorites = await AsyncStorage.getItem(key);
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
        const key = this.getFavoritesKey();
        await AsyncStorage.setItem(key, JSON.stringify(updatedFavorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  static async removeFromFavorites(drinkId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.idDrink !== drinkId);
      const key = this.getFavoritesKey();
      await AsyncStorage.setItem(key, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
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