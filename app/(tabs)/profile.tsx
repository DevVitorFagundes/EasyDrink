import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '../../src/components/Header';
import { useAuth } from '../../src/contexts/AuthContext';
import { FavoritesService } from '../../src/services/FavoritesService';
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '../../src/styles/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadFavoritesCount();
  }, []);

  const loadFavoritesCount = async () => {
    try {
      const favorites = await FavoritesService.getFavorites();
      setFavoritesCount(favorites.length);
    } catch (error) {
      console.error('Error loading favorites count:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Perfil" />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* CARD DO USUÁRIO */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>

          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* ESTATÍSTICAS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🍸</Text>
            <Text style={styles.statValue}>∞</Text>
            <Text style={styles.statLabel}>Receitas Disponíveis</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statValue}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>

        {/* SOBRE */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Sobre o EasyDrink</Text>
          <Text style={styles.aboutText}>
            Descubra milhares de receitas de drinks deliciosos, salve seus
            favoritos e aprenda coquetéis incríveis. Todas as receitas são
            fornecidas pela The Cocktail DB.
          </Text>
        </View>

        {/* BOTÃO DE SAIR */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Sair da Conta</Text>
        </TouchableOpacity>
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
    padding: spacing.lg,
  },

  /* CARD DO USUÁRIO */
  userCard: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  avatarText: {
    fontSize: 42,
  },

  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 4,
  },

  userEmail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },

  /* ESTATÍSTICAS */
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  statIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },

  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  /* SOBRE */
  aboutCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  aboutTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  aboutText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  /* BOTÃO DE SAIR */
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },

  logoutButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
