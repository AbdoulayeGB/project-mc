import { User, LoginCredentials, CreateUserData, UpdateUserData, ROLE_PERMISSIONS, UserWithPassword } from '../types/auth';
import { PostgresService } from './postgresService';

// Fonction simple de hachage de mot de passe (pour la démo)
const hashPassword = (password: string): string => {
  return btoa(password); // Encodage base64 simple pour la démo
};

// Fonction de vérification de mot de passe
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export class AuthService {
  private users: UserWithPassword[] = [];
  private loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.loadUsers();
    this.loadLoginAttempts();
  }

  // Charger les utilisateurs depuis PostgreSQL
  private async loadUsers(): Promise<void> {
    try {
      const users = await PostgresService.getUsers();
      this.users = users.map(user => ({
        ...user,
        password: user.password_hash || '' // Utiliser le hash stocké en base
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      // Utiliser les utilisateurs par défaut en cas d'erreur
      this.users = [
        {
          id: 'admin-1',
          email: 'abdoulaye.niang@cdp.sn',
          name: 'Abdoulaye Niang',
          role: 'admin',
          is_active: true,
          department: 'Direction',
          password: hashPassword('Passer'),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  }



  // Charger les tentatives de connexion depuis localStorage
  private loadLoginAttempts(): void {
    try {
      const stored = localStorage.getItem('loginAttempts');
      if (stored) {
        const attempts = JSON.parse(stored);
        this.loginAttempts = new Map(Object.entries(attempts));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tentatives de connexion:', error);
    }
  }

  // Sauvegarder les tentatives de connexion dans localStorage
  private saveLoginAttempts(): void {
    try {
      const attempts = Object.fromEntries(this.loginAttempts);
      localStorage.setItem('loginAttempts', JSON.stringify(attempts));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tentatives de connexion:', error);
    }
  }

  // Vérifier si un utilisateur est verrouillé
  private isUserLocked(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return false;

    const now = Date.now();
    if (now - attempts.lastAttempt > this.LOCKOUT_DURATION) {
      this.loginAttempts.delete(email);
      this.saveLoginAttempts();
      return false;
    }

    return attempts.count >= this.MAX_LOGIN_ATTEMPTS;
  }

  // Enregistrer une tentative de connexion échouée
  private recordFailedLogin(email: string): void {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);
    this.saveLoginAttempts();
  }

  // Réinitialiser les tentatives de connexion
  private resetLoginAttempts(email: string): void {
    this.loginAttempts.delete(email);
    this.saveLoginAttempts();
  }

  // Connexion utilisateur
  async login(credentials: LoginCredentials): Promise<User> {
    const { email, password } = credentials;

    // Vérifier si l'utilisateur est verrouillé
    if (this.isUserLocked(email)) {
      throw new Error('Compte temporairement verrouillé. Réessayez dans 15 minutes.');
    }

    // Rechercher l'utilisateur directement dans PostgreSQL
    const user = await PostgresService.getUserByEmail(email);
    if (!user || !user.is_active) {
      this.recordFailedLogin(email);
      throw new Error('Email ou mot de passe incorrect');
    }

    // Convertir en UserWithPassword
    const userWithPassword: UserWithPassword = {
      ...user,
      password: user.password_hash || ''
    };

    // Vérifier le mot de passe
    if (!verifyPassword(password, userWithPassword.password)) {
      this.recordFailedLogin(email);
      throw new Error('Email ou mot de passe incorrect');
    }

    // Connexion réussie
    this.resetLoginAttempts(email);

    // Mettre à jour la dernière connexion
    try {
      await PostgresService.updateUser(user.id, { last_login: new Date().toISOString() });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dernière connexion:', error);
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = userWithPassword;
    
    // Créer la session
    this.createSession(userWithoutPassword);
    
    return userWithoutPassword;
  }

  // Créer un nouvel utilisateur
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = this.users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Créer l'utilisateur dans PostgreSQL avec le mot de passe hashé
      const newUser = await PostgresService.createUser({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        is_active: true,
        department: userData.department,
        phone: userData.phone,
        password: hashPassword(userData.password)
      });

      // Ajouter à la liste locale
      this.users.push({
        ...newUser,
        password: hashPassword(userData.password)
      });

      // Retourner l'utilisateur sans le mot de passe
      const { password_hash: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(id: string, updates: UpdateUserData): Promise<User> {
    try {
      // Mettre à jour dans PostgreSQL
      const updatedUser = await PostgresService.updateUser(id, updates);

      // Mettre à jour dans la liste locale
      const index = this.users.findIndex(u => u.id === id);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updatedUser };
      }

      // Retourner l'utilisateur sans le mot de passe
      const { password_hash: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<void> {
    try {
      await PostgresService.deleteUser(id);
      
      // Supprimer de la liste locale
      this.users = this.users.filter(u => u.id !== id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  // Obtenir tous les utilisateurs
  async getUsers(): Promise<User[]> {
    try {
      await this.loadUsers();
      return this.users.map(({ password: _, ...user }) => user);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }

  // Obtenir un utilisateur par ID
  async getUserById(id: string): Promise<User | null> {
    try {
      await this.loadUsers();
      const user = this.users.find(u => u.id === id);
      if (!user) return null;

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  // Obtenir les permissions d'un utilisateur
  getUserPermissions(user: User) {
    return ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.user;
  }

  // Vérifier si un utilisateur a une permission spécifique
  hasPermission(user: User, permission: keyof ReturnType<typeof this.getUserPermissions>): boolean {
    const permissions = this.getUserPermissions(user);
    return permissions[permission] || false;
  }

  // Changer le mot de passe d'un utilisateur
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      // Rechercher l'utilisateur dans PostgreSQL par ID
      const user = await PostgresService.getUserById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier l'ancien mot de passe
      if (!verifyPassword(oldPassword, user.password_hash || '')) {
        throw new Error('Ancien mot de passe incorrect');
      }

      // Mettre à jour le mot de passe dans PostgreSQL
      await PostgresService.updateUserPassword(user.id, hashPassword(newPassword));
      
      // Mettre à jour dans la liste locale
      const localUserIndex = this.users.findIndex(u => u.id === user.id);
      if (localUserIndex !== -1) {
        this.users[localUserIndex].password = hashPassword(newPassword);
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('session');
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    try {
      const sessionData = localStorage.getItem('session');
      if (!sessionData) return null;

      const session = JSON.parse(atob(sessionData));
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem('session');
        return null;
      }

      return session.user;
    } catch {
      localStorage.removeItem('session');
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Créer une session utilisateur
  private createSession(user: User): void {
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        department: user.department,
        phone: user.phone,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 heures
    };

    localStorage.setItem('session', btoa(JSON.stringify(sessionData)));
  }

  // Méthode de débogage pour afficher les utilisateurs
  debugUsers(): void {
    console.log('Utilisateurs actuels:', this.users.map(u => ({ ...u, password: '***' })));
  }

  // Obtenir les rôles disponibles avec leurs descriptions
  getAvailableRoles() {
    return [
      {
        value: 'admin' as const,
        label: 'Administrateur',
        description: 'Accès complet à toutes les fonctionnalités'
      },
      {
        value: 'supervisor' as const,
        label: 'Superviseur',
        description: 'Gestion des missions et rapports'
      },
      {
        value: 'controller' as const,
        label: 'Contrôleur',
        description: 'Contrôle et validation des missions'
      },
      {
        value: 'viewer' as const,
        label: 'Lecteur',
        description: 'Consultation en lecture seule'
      },
      {
        value: 'user' as const,
        label: 'Utilisateur',
        description: 'Accès limité aux fonctionnalités de base'
      }
    ];
  }
}

// Instance singleton
export const authService = new AuthService();
