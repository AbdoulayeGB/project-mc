import { initializeDatabase, executeQuery } from '../database/db';
import path from 'path';
import fs from 'fs';

// Fonction pour générer une référence unique
const generateReference = () => {
  const prefix = 'CTL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Fonction pour générer une date aléatoire dans les 30 derniers jours
const getRandomDate = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Liste des missions de contrôle d'exemple
const sampleControlMissions = [
  {
    reference: generateReference(),
    title: "Contrôle RGPD - Banque Atlantique",
    description: "Contrôle de conformité au RGPD des traitements de données personnelles des clients",
    status: "PLANIFIEE",
    priority: "HAUTE",
    start_date: getRandomDate(),
    end_date: getRandomDate(),
    assigned_to: "inspecteur1@cdp.sn",
    created_by: "admin@cdp.sn",
    organization: "Banque Atlantique Sénégal",
    address: "Dakar Plateau, Avenue Léopold Sédar Senghor",
    team_members: JSON.stringify(["Inspecteur Principal", "Inspecteur Assistant", "Expert Technique"]),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: "Audit Protection des Données - SONATEL",
    description: "Audit complet des mesures de protection des données personnelles",
    status: "PLANIFIEE", 
    priority: "HAUTE",
    start_date: getRandomDate(),
    end_date: getRandomDate(),
    assigned_to: "inspecteur2@cdp.sn",
    created_by: "admin@cdp.sn",
    organization: "SONATEL",
    address: "Route des Almadies, Dakar",
    team_members: JSON.stringify(["Chef de Mission", "Expert Technique", "Juriste"]),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(),
    title: "Contrôle Données Santé - Hôpital Principal",
    description: "Contrôle du traitement des données de santé des patients",
    status: "PLANIFIEE",
    priority: "HAUTE",
    start_date: getRandomDate(),
    end_date: getRandomDate(),
    assigned_to: "inspecteur3@cdp.sn",
    created_by: "admin@cdp.sn",
    organization: "Hôpital Principal de Dakar",
    address: "Avenue Nelson Mandela, Dakar",
    team_members: JSON.stringify(["Expert Médical", "Inspecteur Principal", "Expert Technique"]),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Fonction pour insérer les utilisateurs de base
async function insertBaseUsers() {
  const users = [
    { email: 'admin@cdp.sn', full_name: 'Administrateur CDP', role: 'ADMIN' },
    { email: 'inspecteur1@cdp.sn', full_name: 'Inspecteur Principal', role: 'CONTROLLER' },
    { email: 'inspecteur2@cdp.sn', full_name: 'Inspecteur Assistant', role: 'CONTROLLER' },
    { email: 'inspecteur3@cdp.sn', full_name: 'Expert Technique', role: 'CONTROLLER' }
  ];

  for (const user of users) {
    const query = `
      INSERT OR IGNORE INTO users (email, full_name, role)
      VALUES (?, ?, ?)
    `;
    await executeQuery(query, [user.email, user.full_name, user.role]);
  }
}

// Fonction pour sauvegarder les missions dans un fichier JSON
async function saveMissionsToJson(missions: any[]) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, 'control-missions.json');
  fs.writeFileSync(filePath, JSON.stringify(missions, null, 2));
  console.log(`Missions sauvegardées dans ${filePath}`);
}

// Fonction principale pour insérer les missions
async function insertControlMissions() {
  try {
    // Initialiser la base de données
    await initializeDatabase();
    console.log('Base de données initialisée');

    // Insérer les utilisateurs de base
    await insertBaseUsers();
    console.log('Utilisateurs de base insérés');

    // Sauvegarder les missions dans un fichier JSON
    await saveMissionsToJson(sampleControlMissions);

    // Insérer chaque mission dans la base de données
    for (const mission of sampleControlMissions) {
      const query = `
        INSERT INTO missions (
          reference, title, description, status, priority,
          start_date, end_date, assigned_to, created_by,
          organization, address, team_members,
          created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await executeQuery(query, [
        mission.reference,
        mission.title,
        mission.description,
        mission.status,
        mission.priority,
        mission.start_date.toISOString(),
        mission.end_date.toISOString(),
        mission.assigned_to,
        mission.created_by,
        mission.organization,
        mission.address,
        mission.team_members,
        mission.created_at,
        mission.updated_at
      ]);

      console.log(`Mission ${mission.reference} insérée avec succès`);
    }

    console.log('Toutes les missions de contrôle ont été insérées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des missions:', error);
  }
}

// Exécuter le script
insertControlMissions(); 