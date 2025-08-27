# 🔧 Guide de Configuration PostgreSQL - CDP Missions

## 📋 Étapes de Configuration

### 1. Installation de PostgreSQL

**Windows :**
1. Téléchargez PostgreSQL depuis [postgresql.org](https://www.postgresql.org/download/windows/)
2. Installez avec l'utilisateur `postgres`
3. Notez le mot de passe que vous définissez

**macOS :**
```bash
brew install postgresql
brew services start postgresql
```

**Linux :**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Créer la Base de Données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE cdp_missions;

# Vérifier que la base existe
\l

# Se connecter à la base
\c cdp_missions

# Quitter
\q
```

### 3. Configuration du Fichier .env

Créez un fichier `.env` dans le dossier racine avec :

```env
# Configuration PostgreSQL
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=cdp_missions
VITE_DB_USER=postgres
VITE_DB_PASSWORD=votre_mot_de_passe_postgres

# Configuration Application
VITE_APP_NAME=CDP Missions
VITE_APP_VERSION=1.0.0
```

### 4. Initialiser la Base de Données

```bash
# Installer les dépendances
npm install

# Initialiser la base de données
npm run init-postgres
```

### 5. Tester la Connexion

```bash
npm run test-db
```

### 6. Démarrer l'Application

```bash
npm run dev
```

## 🔍 Diagnostic

Si vous avez des problèmes :

1. **Vérifiez que PostgreSQL est démarré**
2. **Vérifiez les informations de connexion dans .env**
3. **Testez la connexion manuellement :**
   ```bash
   psql -U postgres -d cdp_missions
   ```

## 👤 Accès à l'Application

- **URL :** http://localhost:5173
- **Admin :** abdoulaye.niang@cdp.sn / Passer

## 🛠️ Scripts Disponibles

- `npm run dev` - Démarrer l'application
- `npm run test-db` - Tester la connexion PostgreSQL
- `npm run init-postgres` - Initialiser la base de données
- `npm run setup-postgres` - Configuration interactive

## 📊 Structure de la Base

L'application crée automatiquement :
- Table `users` - Gestion des utilisateurs
- Table `missions` - Missions de contrôle
- Table `documents` - Documents associés
- Table `findings` - Constatations
- Table `sanctions` - Sanctions
- Table `remarks` - Remarques

## 🔒 Sécurité

- Mots de passe hashés
- Protection contre les attaques par force brute
- Sessions sécurisées
- Gestion des rôles et permissions
