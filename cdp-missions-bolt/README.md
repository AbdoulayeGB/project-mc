# 🚀 CDP Missions - Application de Gestion des Missions

Application de gestion des missions de contrôle pour la CDP (Commission de Déontologie et de Prévention).

## 📋 Prérequis

- **PostgreSQL** installé sur votre machine
- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**

## 🔧 Configuration Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration PostgreSQL
```bash
npm run setup-postgres
```

Ce script vous guidera pour :
- Configurer la connexion PostgreSQL
- Créer le fichier `.env`
- Initialiser la base de données
- Tester la connexion

### 3. Démarrage de l'application
```bash
npm run dev
```

## 🔍 Diagnostic

Pour vérifier la configuration :
```bash
npm run test-db
```

## 📊 Accès à l'application

- **URL** : http://localhost:5173
- **Admin** : abdoulaye.niang@cdp.sn / Passer

## 🛠️ Scripts Disponibles

- `npm run dev` - Démarrer en mode développement
- `npm run build` - Construire pour la production
- `npm run setup-postgres` - Configurer PostgreSQL
- `npm run test-db` - Tester la connexion base de données
- `npm run init-postgres` - Initialiser la base de données

## 📁 Structure du Projet

```
cdp-missions-bolt/
├── src/
│   ├── components/     # Composants React
│   ├── services/       # Services (PostgreSQL, Auth)
│   ├── types/          # Types TypeScript
│   └── config/         # Configuration
├── postgres-setup.sql  # Script d'initialisation DB
├── setup-postgres.js   # Script de configuration
└── .env.example        # Variables d'environnement
```

## 🔒 Sécurité

- Authentification avec mots de passe hashés
- Protection contre les attaques par force brute
- Gestion des rôles et permissions
- Sessions sécurisées

## 🆘 Support

En cas de problème :
1. Consultez `CONFIGURATION_POSTGRESQL.md`
2. Utilisez le diagnostic intégré dans l'application
3. Vérifiez les logs de l'application
