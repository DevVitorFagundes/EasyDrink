import { Drink, DrinkDetail } from '../types';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export class DrinkService {
  static async getRandomDrinks(count: number = 12): Promise<Drink[]> {
    try {
      const promises = Array.from({ length: count }, () =>
        fetch(`${BASE_URL}/random.php`).then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const drinks = results
        .map(result => result.drinks?.[0])
        .filter(Boolean)
        .filter((drink, index, self) => 
          // Remove duplicates
          self.findIndex(d => d.idDrink === drink.idDrink) === index
        );
      
      return drinks;
    } catch (error) {
      console.error('Error fetching random drinks:', error);
      return [];
    }
  }

  static async searchDrinks(searchTerm: string): Promise<Drink[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      return data.drinks || [];
    } catch (error) {
      console.error('Error searching drinks:', error);
      return [];
    }
  }

  static async getDrinkById(id: string): Promise<DrinkDetail | null> {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.drinks?.[0] || null;
    } catch (error) {
      console.error('Error fetching drink details:', error);
      return null;
    }
  }
}