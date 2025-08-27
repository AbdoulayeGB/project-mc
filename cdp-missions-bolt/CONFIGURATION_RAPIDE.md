# 🚀 Configuration Rapide PostgreSQL

## 📋 Étapes de configuration

### 1. Installer PostgreSQL
- **Windows** : Télécharger depuis [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS** : `brew install postgresql && brew services start postgresql`
- **Linux** : `sudo apt install postgresql postgresql-contrib`

### 2. Créer la base de données
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE cdp_missions;

# Quitter psql
\q
```

### 3. Initialiser la base de données
```bash
# Installer les dépendances
npm install

# Initialiser la base de données
npm run init-postgres
```

### 4. Configurer les variables d'environnement
Créer un fichier `.env` à la racine du projet :
```env
# Configuration PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cdp_missions
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres

# Configuration de l'application
VITE_APP_NAME=CDP Missions
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

### 5. Démarrer l'application
```bash
npm run dev
```

## 🔑 Identifiants de connexion

**Utilisateur admin par défaut :**
- Email : `abdoulaye.niang@cdp.sn`
- Mot de passe : `Passer`
- Rôle : `admin`

## 🛠️ Commandes utiles

```bash
# Vérifier la connexion PostgreSQL
psql -h localhost -U postgres -d cdp_missions -c "SELECT NOW();"

# Lister les tables
psql -h localhost -U postgres -d cdp_missions -c "\dt"

# Vérifier l'utilisateur admin
psql -h localhost -U postgres -d cdp_missions -c "SELECT * FROM users WHERE email = 'abdoulaye.niang@cdp.sn';"
```

## 🚨 Dépannage

### Problème : "Connection refused"
- Vérifier que PostgreSQL est démarré
- Vérifier le port (5432 par défaut)
- Vérifier les paramètres de connexion dans `.env`

### Problème : "Authentication failed"
- Vérifier le mot de passe dans `.env`
- Vérifier que l'utilisateur `postgres` existe

### Problème : "Database does not exist"
- Créer la base de données : `CREATE DATABASE cdp_missions;`

## ✅ Vérification

Après la configuration, vous devriez pouvoir :
1. Vous connecter avec l'utilisateur admin
2. Créer de nouveaux utilisateurs
3. Gérer les missions
4. Voir les données persistées après redémarrage
