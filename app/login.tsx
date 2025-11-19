import {router} from "expo-router";
import React, {useState} from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {useAuth} from "../src/contexts/AuthContext";
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "../src/styles/theme";

export default function LoginScreen() {
  const {login, register} = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Erro no Login", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password, name.trim());
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Erro no Cadastro", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>��</Text>
              </View>
              <Text style={styles.title}>Easy Drink</Text>
              <Text style={styles.subtitle}>
                {isLogin ? "Entre em sua conta" : "Crie sua conta"}
              </Text>
            </View>
            <View style={styles.form}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Seu nome completo"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              )}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  autoComplete="password"
                  editable={!loading}
                />
              </View>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirmar Senha</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Digite a senha novamente"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    editable={!loading}
                  />
                </View>
              )}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={isLogin ? handleLogin : handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.buttonText}>
                    {isLogin ? "Entrar" : "Criar Conta"}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.switchButton}
                onPress={toggleMode}
                disabled={loading}
              >
                <Text style={styles.switchText}>
                  {isLogin
                    ? "Não tem conta? Cadastre-se"
                    : "Já tem conta? Faça login"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  keyboardView: {flex: 1},
  scrollContent: {flexGrow: 1},
  content: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  header: {alignItems: "center", marginBottom: spacing.xl},
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconText: {fontSize: 40},
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {fontSize: fontSize.md, color: colors.textSecondary},
  form: {gap: spacing.md},
  inputContainer: {gap: spacing.xs},
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.white,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
    minHeight: 50,
    justifyContent: "center",
  },
  buttonDisabled: {opacity: 0.6},
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  switchButton: {alignItems: "center", paddingVertical: spacing.sm},
  switchText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
});
