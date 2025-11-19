export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
}

export interface DrinkDetail extends Drink {
  strAlcoholic: string;
  strInstructions: string;
  strGlass: string;
  [key: string]: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
}

export interface Ingredient {
  name: string;
  measure: string;
}

export interface RootStackParamList {
  DrinkDetail: { drinkId: string };
  Favorites: undefined;
}