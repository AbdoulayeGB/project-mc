## Démarrage rapide (PostgreSQL local)

### Prérequis
- Node.js 18+
- PostgreSQL (port par défaut 5432)

### 1) Cloner et se placer dans le projet
```bash
git clone https://github.com/AbdoulayeGB/project-mc.git
cd project-mc
```

### 2) Configurer PostgreSQL
- Créez la base si nécessaire:
```bash
psql -U postgres -c "CREATE DATABASE cdp_missions;"
```
- Renseignez votre mot de passe Postgres dans `pro-mc/server/.env` (clé `DB_PASSWORD`).

### 3) Installer les dépendances
```bash
cd pro-mc/server && npm install
```

### 4) Migrer et insérer des données
```bash
npm run db:migrate
npm run db:seed
```

### 5) Démarrer l’API locale
```bash
npm run dev
```
- Test santé: ouvrez `http://localhost:3000/api/health` (doit indiquer PostgreSQL)

### 6) Frontend (optionnel)
Dans un autre terminal:
```bash
cd ../
npm install
npm run dev
```

### Notes
- Le backend a été basculé sur PostgreSQL (plus de Supabase).
- Auth locale via JWT et validateurs simples.
- Les services frontend consomment l’API sur `http://localhost:3000/api`.

### Liens
- Dépôt: https://github.com/AbdoulayeGB/project-mc
- Release v0.1.0: https://github.com/AbdoulayeGB/project-mc/releases/tag/v0.1.0
# 🚀 CDP Missions - Version Bolt.new

Application de gestion des missions de contrôle pour le CDP (Comité de Développement et de Promotion).

## 🎯 Fonctionnalités

- ✅ **Gestion des missions** (création, modification, suppression)
- ✅ **Authentification** avec rôles (admin, supervisor, controller, viewer, user)
- ✅ **Tableau de bord** avec statistiques
- ✅ **Recherche avancée** des missions
- ✅ **Gestion des documents** par mission
- ✅ **Alertes de changement de statut**
- ✅ **Interface responsive** et moderne

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
npm install
npm run dev
```

### Connexion
- **Email** : `abdoulaye.niang@cdp.sn`
- **Mot de passe** : `Passer`

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Build** : Vite
- **Routing** : React Router DOM
- **Notifications** : React Hot Toast
- **Icons** : Heroicons

## 📁 Structure

```
src/
├── components/     # Composants React
├── contexts/       # Contextes (Auth)
├── hooks/          # Hooks personnalisés
├── services/       # Services (Mock pour Bolt.new)
├── types/          # Types TypeScript
└── utils/          # Utilitaires
```

## 🔧 Configuration

Cette version utilise des données mockées pour fonctionner sur Bolt.new sans dépendances externes.

## 📝 Licence

Projet interne CDP.
