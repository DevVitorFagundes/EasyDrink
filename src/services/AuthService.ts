import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types';

export class AuthService {
  /**
   * Registra um novo usuário
   */
  static async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualiza o perfil com o nome
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      return {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        name: name,
      };
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Faz login com email e senha
   */
  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        name: userCredential.user.displayName || email.split('@')[0],
      };
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Faz logout
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Envia email de recuperação de senha
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  /**
   * Observa mudanças no estado de autenticação
   */
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
        });
      } else {
        callback(null);
      }
    });
  }

  /**
   * Converte erros do Firebase em mensagens amigáveis
   */
  private static handleFirebaseError(error: any): Error {
    const errorCode = error.code;
    let message = 'Erro ao processar sua solicitação';

    switch (errorCode) {
      case 'auth/email-already-in-use':
        message = 'Este email já está cadastrado';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operação não permitida';
        break;
      case 'auth/weak-password':
        message = 'Senha muito fraca. Use pelo menos 6 caracteres';
        break;
      case 'auth/user-disabled':
        message = 'Usuário desabilitado';
        break;
      case 'auth/user-not-found':
        message = 'Usuário não encontrado';
        break;
      case 'auth/wrong-password':
        message = 'Email ou senha incorretos';
        break;
      case 'auth/invalid-credential':
        message = 'Credenciais inválidas';
        break;
      case 'auth/network-request-failed':
        message = 'Erro de conexão. Verifique sua internet';
        break;
      case 'auth/too-many-requests':
        message = 'Muitas tentativas. Tente novamente mais tarde';
        break;
      default:
        message = error.message || 'Erro desconhecido';
    }

    return new Error(message);
  }

  /**
   * Obtém o usuário atual
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}
