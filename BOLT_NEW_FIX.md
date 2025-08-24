# 🔧 Correction pour Bolt.new

## 🚨 **PROBLÈMES IDENTIFIÉS**

### **1. Structure de Repository Complexe**
```
project-mc/
├── pro-mc/          ← Votre vrai projet React
├── server/          ← Backend Express (inutile pour Bolt.new)
├── src/             ← Autre code (inutile)
├── package.json     ← Package.json racine (incorrect)
└── index.js         ← Fichier racine (incorrect)
```

### **2. Package.json Racine Incorrect**
Le package.json racine pointe vers `node index.js` au lieu d'un projet React.

### **3. Dépendances Incompatibles**
- **Dexie.js** (IndexedDB) - ne fonctionne pas sur Bolt.new
- **SQLite** - ne fonctionne pas sur Bolt.new
- **Supabase** - nécessite configuration

## ✅ **SOLUTIONS**

### **Solution 1 : Créer un Repository Simplifié**
1. **Créez un nouveau repository** : `cdp-missions-simple`
2. **Copiez seulement** le dossier `pro-mc/`
3. **Supprimez** les dépendances problématiques
4. **Ajoutez** un package.json simplifié

### **Solution 2 : Modifier la Structure Actuelle**
1. **Déplacez** le contenu de `pro-mc/` à la racine
2. **Supprimez** les dossiers `server/`, `src/` (racine)
3. **Supprimez** `index.js` et `package.json` (racine)

### **Solution 3 : Créer un Version Bolt.new Compatible**
```json
{
  "name": "cdp-missions-bolt",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-hot-toast": "^2.4.1",
    "@heroicons/react": "^2.0.18",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

## 🎯 **RECOMMANDATION**

**Utilisez Gitpod** au lieu de Bolt.new :
```
https://gitpod.io/#https://github.com/AbdoulayeGB/project-mc
```

Gitpod :
- ✅ Supporte les projets complexes
- ✅ Gère les variables d'environnement
- ✅ Plus stable que Bolt.new
