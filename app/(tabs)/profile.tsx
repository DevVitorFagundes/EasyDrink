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
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../../src/styles/theme';

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
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Perfil" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🍸</Text>
            <Text style={styles.statValue}>∞</Text>
            <Text style={styles.statLabel}>Receitas Disponíveis</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statValue}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Receitas Favoritas</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Sobre o Easy Drink</Text>
          <Text style={styles.aboutText}>
            Descubra milhares de receitas de drinks deliciosos, salve seus favoritos e 
            aprenda a fazer coquetéis incríveis. Todas as receitas são fornecidas pela 
            The Cocktail DB, uma base de dados completa e gratuita.
          </Text>
        </View>

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
    flex: 1,
    padding: spacing.lg,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
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
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
