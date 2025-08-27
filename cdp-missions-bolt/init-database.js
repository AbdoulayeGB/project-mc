import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de la base de données
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'cdp_missions',
  user: 'postgres',
  password: 'password'
});

async function initDatabase() {
  try {
    console.log('🚀 Initialisation de la base de données PostgreSQL...');
    
    // Lire le script SQL
    const sqlScript = fs.readFileSync(path.join(__dirname, 'postgres-setup.sql'), 'utf8');
    
    // Exécuter le script
    await pool.query(sqlScript);
    
    console.log('✅ Base de données initialisée avec succès !');
    console.log('📋 Tables créées :');
    console.log('   - users');
    console.log('   - missions');
    console.log('   - documents');
    console.log('   - findings');
    console.log('   - sanctions');
    console.log('   - remarks');
    console.log('');
    console.log('👤 Utilisateur admin créé :');
    console.log('   Email: abdoulaye.niang@cdp.sn');
    console.log('   Mot de passe: Passer');
    console.log('   Rôle: admin');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Exécuter l'initialisation
initDatabase();
