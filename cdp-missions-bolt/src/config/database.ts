import { Pool, PoolConfig } from 'pg';

// Configuration de la base de données PostgreSQL
const dbConfig: PoolConfig = {
  user: import.meta.env.VITE_DB_USER || 'postgres',
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  database: import.meta.env.VITE_DB_NAME || 'cdp_missions',
  password: import.meta.env.VITE_DB_PASSWORD || 'password',
  port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
  max: 20, // Nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Créer le pool de connexions
export const pool = new Pool(dbConfig);

// Test de connexion
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Connexion PostgreSQL réussie:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error);
    return false;
  }
};

// Fermer le pool de connexions
export const closePool = async (): Promise<void> => {
  await pool.end();
};

// Vérifier si la base de données existe
export const checkDatabaseExists = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'missions'
      );
    `);
    client.release();
    return result.rows[0].exists;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la base de données:', error);
    return false;
  }
};
