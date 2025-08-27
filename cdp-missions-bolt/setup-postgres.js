import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Configuration PostgreSQL pour CDP Missions');
console.log('==============================================\n');

// Demander les informations de configuration
import readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupPostgreSQL() {
  try {
    console.log('📋 Veuillez fournir les informations de configuration PostgreSQL :\n');
    
    const host = await askQuestion('Host (défaut: localhost): ') || 'localhost';
    const port = await askQuestion('Port (défaut: 5432): ') || '5432';
    const database = await askQuestion('Nom de la base de données (défaut: cdp_missions): ') || 'cdp_missions';
    const user = await askQuestion('Utilisateur (défaut: postgres): ') || 'postgres';
    const password = await askQuestion('Mot de passe: ');
    
    console.log('\n🔧 Test de connexion...');
    
    // Test de connexion
    const pool = new Pool({
      host,
      port: parseInt(port),
      database,
      user,
      password
    });
    
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Connexion PostgreSQL réussie !');
      console.log(`Heure du serveur: ${result.rows[0].now}\n`);
      
      // Créer le fichier .env
      const envContent = `# Configuration PostgreSQL
VITE_DB_HOST=${host}
VITE_DB_PORT=${port}
VITE_DB_NAME=${database}
VITE_DB_USER=${user}
VITE_DB_PASSWORD=${password}

# Configuration Application
VITE_APP_NAME=CDP Missions
VITE_APP_VERSION=1.0.0
`;
      
      fs.writeFileSync('.env', envContent);
      console.log('✅ Fichier .env créé avec succès !');
      
      // Vérifier si la base de données existe
      console.log('\n🔍 Vérification de la base de données...');
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'missions'
        );
      `);
      
      if (tableCheck.rows[0].exists) {
        console.log('✅ Tables existantes détectées !');
      } else {
        console.log('⚠️  Tables manquantes. Initialisation de la base de données...');
        
        // Lire et exécuter le script SQL
        const sqlPath = path.join(__dirname, 'postgres-setup.sql');
        if (fs.existsSync(sqlPath)) {
          const sqlContent = fs.readFileSync(sqlPath, 'utf8');
          await pool.query(sqlContent);
          console.log('✅ Base de données initialisée avec succès !');
        } else {
          console.log('❌ Fichier postgres-setup.sql non trouvé !');
        }
      }
      
      await pool.end();
      console.log('\n🎉 Configuration PostgreSQL terminée !');
      console.log('Vous pouvez maintenant démarrer l\'application avec : npm run dev');
      
    } catch (error) {
      console.error('❌ Erreur de connexion PostgreSQL:', error.message);
      console.log('\n🔧 Solutions possibles :');
      console.log('1. Vérifiez que PostgreSQL est installé et démarré');
      console.log('2. Vérifiez les informations de connexion');
      console.log('3. Créez la base de données : CREATE DATABASE cdp_missions;');
      console.log('4. Vérifiez les permissions de l\'utilisateur');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  } finally {
    rl.close();
  }
}

setupPostgreSQL();
