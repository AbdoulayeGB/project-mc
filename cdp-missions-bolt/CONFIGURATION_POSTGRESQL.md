# 🚀 Guide de Configuration PostgreSQL pour CDP Missions

Ce guide vous aide à configurer PostgreSQL pour l'application CDP Missions.

## 📋 Prérequis

1. **PostgreSQL installé** sur votre machine
2. **Node.js** (version 16 ou supérieure)
3. **npm** ou **yarn**

## 🔧 Installation de PostgreSQL

### Windows
1. Téléchargez PostgreSQL depuis [postgresql.org](https://www.postgresql.org/download/windows/)
2. Installez avec l'utilisateur `postgres` et un mot de passe de votre choix
3. Notez le port (par défaut : 5432)

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 🗄️ Configuration de la Base de Données

### 1. Créer la base de données
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

### 2. Initialiser la base de données
```bash
# Dans le dossier du projet
npm run init-postgres
```

## ⚙️ Variables d'Environnement

Créez un fichier `.env` dans le dossier racine :

```env
# Configuration PostgreSQL
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=cdp_missions
VITE_DB_USER=postgres
VITE_DB_PASSWORD=votre_mot_de_passe

# Configuration Application
VITE_APP_NAME=CDP Missions
VITE_APP_VERSION=1.0.0
```

## 🚀 Démarrage de l'Application

### 1. Installer les dépendances
```bash
npm install
```

### 2. Vérifier la connexion
```bash
npm run test-db
```

### 3. Démarrer l'application
```bash
npm run dev
```

## 🔍 Diagnostic

L'application inclut un diagnostic PostgreSQL accessible via :
- Menu "Debug" > "Diagnostic PostgreSQL"

Ce diagnostic vérifie :
- ✅ Connexion à PostgreSQL
- ✅ Existence des tables
- ✅ Présence de l'utilisateur admin
- ✅ Intégrité des données

## 🛠️ Dépannage

### Problème : "Erreur de connexion PostgreSQL"
**Solutions :**
- Vérifiez que PostgreSQL est démarré
- Vérifiez les variables d'environnement
- Testez la connexion : `psql -U postgres -d cdp_missions`

### Problème : "Tables manquantes"
**Solutions :**
- Exécutez : `npm run init-postgres`
- Vérifiez le fichier `postgres-setup.sql`

### Problème : "Utilisateur admin manquant"
**Solutions :**
- L'utilisateur admin est créé automatiquement
- Mot de passe : `Passer`

- Email : `abdoulaye.niang@cdp.sn`
### Problème : "Permissions insuffisantes"
**Solutions :**
- Vérifiez les permissions de l'utilisateur PostgreSQL
- Assurez-vous que l'utilisateur peut créer/modifier des tables

## 📊 Structure de la Base de Données

### Tables principales :
- `users` - Utilisateurs et authentification
- `missions` - Missions de contrôle
- `documents` - Documents associés aux missions
- `findings` - Constatations
- `sanctions` - Sanctions
- `remarks` - Remarques

### Index et contraintes :
- Clés primaires sur tous les IDs
- Index sur les dates et statuts
- Contraintes de référence entre tables

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Protection contre les attaques par force brute
- Sessions sécurisées avec JWT
- Validation des données côté serveur

## 📝 Notes Importantes

- L'application fonctionne en mode **local** avec PostgreSQL
- Les données sont persistantes et sécurisées
- Sauvegardez régulièrement votre base de données
- Pour la production, configurez un serveur PostgreSQL dédié

## 🆘 Support

En cas de problème :
1. Consultez les logs de l'application
2. Vérifiez la connexion PostgreSQL
3. Utilisez le diagnostic intégré
4. Consultez la documentation PostgreSQL
