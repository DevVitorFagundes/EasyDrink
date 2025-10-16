export type RootStackParamList = {
  MainTabs: undefined;
  DrinkDetail: {drinkId: string};
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export interface SimpleScreenProps {
  onDrinkPress?: (drinkId: string) => void;
  onSearchPress?: () => void;
  onNavigateBack?: () => void;
}