import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text } from "react-native";

// Context
import { useAuth } from "../contexts/AuthContext";

// Screens
import { DrinkDetailScreen } from "../screens/DrinkDetailScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SearchScreen } from "../screens/SearchScreen";

// Theme
import { colors } from "../styles/theme";

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

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon: React.FC<{name: string; focused: boolean}> = ({
  name,
  focused,
}) => {
  const getIcon = () => {
    switch (name) {
      case "Home":
        return "🏠";
      case "Search":
        return "🔍";
      case "Favorites":
        return "❤️";
      case "Profile":
        return "👤";
      default:
        return "?";
    }
  };

  return (
    <Text style={[styles.tabIcon, {opacity: focused ? 1 : 0.6}]}>
      {getIcon()}
    </Text>
  );
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        options={{title: "Início"}}
      >
        {() => (
          <HomeScreen
            onDrinkPress={(drinkId) => {
              console.log('Navigate to drink:', drinkId);
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{title: "Buscar"}}
      >
        {() => (
          <SearchScreen
            onDrinkPress={(drinkId) => {
              console.log('Navigate to drink:', drinkId);
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Favorites"
        options={{title: "Favoritos"}}
      >
        {() => (
          <FavoritesScreen
            onDrinkPress={(drinkId) => {
              // Navegação simplificada - você pode implementar sua própria lógica aqui
              console.log('Navigate to drink:', drinkId);
            }}
            onSearchPress={() => {
              // Navegação simplificada - você pode implementar sua própria lógica aqui
              console.log('Navigate to search');
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{title: "Perfil"}}
      >
        {() => (
          <ProfileScreen
            onLogout={() => {
              console.log('User logout');
            }}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return null; // ou um loading screen
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DrinkDetail"
        options={{title: "Detalhes do Drink"}}
      >
        {({ route, navigation }) => (
          <DrinkDetailScreen
            drinkId={route.params.drinkId}
            onGoBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 22,
  },
});