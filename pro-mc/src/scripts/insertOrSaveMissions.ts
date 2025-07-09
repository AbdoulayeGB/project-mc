import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Mission } from '../types/mission';

// Charger les variables d'environnement
dotenv.config();

// Vérifier si les variables d'environnement sont définies
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Fonction pour générer une référence unique
const generateReference = () => {
  const prefix = 'MIS';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Fonction pour générer une date aléatoire dans les 30 derniers jours
const getRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
};

// Fonction pour formater une date en ISO string
const formatDate = (date: Date) => date.toISOString();

// Liste des missions d'exemple
const sampleMissions = [
  {
    reference: generateReference(),
    title: 'Contrôle de la conformité RGPD - Orange Sénégal',
    description: 'Vérification de la conformité au RGPD des traitements de données personnelles, notamment la gestion des consentements et les droits des personnes.',
    status: 'PLANIFIEE',
    priority: 'Haute',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user1@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Audit de sécurité - Expresso',
    description: 'Évaluation approfondie des mesures de sécurité mises en place pour protéger les données personnelles des abonnés.',
    status: 'PLANIFIEE',
    priority: 'Haute',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user2@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Contrôle des sous-traitants - Free Sénégal',
    description: 'Vérification de la conformité des sous-traitants aux obligations RGPD et de la gestion des contrats de sous-traitance.',
    status: 'PLANIFIEE',
    priority: 'Moyenne',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user3@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Évaluation des registres de traitement - Wave',
    description: 'Contrôle de la tenue et de l\'exhaustivité des registres de traitement des données personnelles.',
    status: 'PLANIFIEE',
    priority: 'Moyenne',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user1@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Contrôle des transferts internationaux - Orange Money',
    description: 'Vérification de la conformité des transferts internationaux de données et des garanties appropriées.',
    status: 'PLANIFIEE',
    priority: 'Haute',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user2@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Audit des procédures de notification - Free Money',
    description: 'Évaluation des procédures de notification des violations de données et de la gestion des incidents.',
    status: 'PLANIFIEE',
    priority: 'Moyenne',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user3@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Contrôle des droits des personnes - Wave',
    description: 'Vérification de la mise en œuvre effective des droits des personnes (accès, rectification, effacement, etc.).',
    status: 'PLANIFIEE',
    priority: 'Moyenne',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user1@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Évaluation des DPO - Orange Sénégal',
    description: 'Contrôle de l\'indépendance et des moyens mis à disposition du DPO pour exercer ses missions.',
    status: 'PLANIFIEE',
    priority: 'Basse',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user2@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Contrôle des analyses d\'impact - Expresso',
    description: 'Vérification de la réalisation et de la qualité des analyses d\'impact sur la protection des données.',
    status: 'PLANIFIEE',
    priority: 'Haute',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user3@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: 'Audit des mesures techniques - Free Sénégal',
    description: 'Évaluation des mesures techniques de sécurité (chiffrement, pseudonymisation, etc.) mises en place.',
    status: 'PLANIFIEE',
    priority: 'Haute',
    start_date: formatDate(getRandomDate()),
    end_date: formatDate(getRandomDate()),
    assigned_to: 'user1@example.com',
    created_by: 'admin@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Fonction pour sauvegarder les missions dans un fichier JSON
function saveMissionsLocally() {
  try {
    // Créer le dossier data s'il n'existe pas
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Chemin du fichier JSON
    const filePath = path.join(dataDir, 'sample-missions.json');
    
    // Écrire les missions dans le fichier JSON
    fs.writeFileSync(filePath, JSON.stringify(sampleMissions, null, 2));
    
    console.log(`Missions sauvegardées avec succès dans ${filePath}`);
    console.log(`Nombre de missions sauvegardées: ${sampleMissions.length}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des missions:', error);
    return false;
  }
}

// Fonction pour insérer les missions dans Supabase
async function insertMissionsToSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requises');
    return false;
  }

  try {
    // Créer le client Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Tentative d\'insertion des missions dans Supabase...');
    const { data, error } = await supabase
      .from('missions')
      .insert(sampleMissions);

    if (error) {
      throw error;
    }

    console.log('Missions insérées avec succès dans Supabase:', data);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'insertion des missions dans Supabase:', error);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('Démarrage du processus d\'insertion ou de sauvegarde des missions...');
  
  // Essayer d'abord d'insérer dans Supabase
  const supabaseSuccess = await insertMissionsToSupabase();
  
  // Si l'insertion dans Supabase échoue, sauvegarder localement
  if (!supabaseSuccess) {
    console.log('L\'insertion dans Supabase a échoué. Tentative de sauvegarde locale...');
    const localSuccess = saveMissionsLocally();
    
    if (localSuccess) {
      console.log('Les missions ont été sauvegardées localement avec succès.');
    } else {
      console.error('Échec de la sauvegarde locale des missions.');
    }
  }
}

// Exécuter la fonction principale
main(); 