const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Mission } = require('./models/Mission');

const app = express();
const port = 3000;

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

app.use(express.json());

// Configuration MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/cdp-missions';

console.log('Tentative de connexion à MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB avec succès');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  });

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/api/missions', async (req, res) => {
  try {
    console.log('GET /api/missions - Récupération des missions...');
    const missions = await Mission.find();
    console.log(`✅ ${missions.length} missions trouvées`);
    res.json(missions);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des missions:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des missions' });
  }
});

app.get('/api/missions/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la mission' });
  }
});

app.post('/api/missions', async (req, res) => {
  try {
    console.log('POST /api/missions - Création d\'une nouvelle mission');
    console.log('Données reçues:', req.body);
    
    // Validation des données requises
    const requiredFields = [
      'reference', 'title', 'description', 'type_mission',
      'organization', 'address', 'start_date', 'end_date',
      'status', 'motif_controle', 'decision_numero', 'date_decision'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      console.error('❌ Champs manquants:', missingFields);
      return res.status(400).json({ 
        error: 'Champs obligatoires manquants',
        missingFields 
      });
    }

    // Création de la mission avec les données validées
    const mission = new Mission({
      ...req.body,
      team_members: Array.isArray(req.body.team_members) ? req.body.team_members : [],
      objectives: Array.isArray(req.body.objectives) ? req.body.objectives : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const savedMission = await mission.save();
    console.log('✅ Mission créée avec succès:', savedMission);
    res.status(201).json(savedMission);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la mission:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ 
        error: 'Erreur de validation',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Erreur lors de la création de la mission' });
  }
});

app.put('/api/missions/:id', async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la mission' });
  }
});

app.delete('/api/missions/:id', async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la mission' });
  }
});

// Routes pour les constats, remarques et sanctions
app.post('/api/missions/:id/findings', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    mission.findings.push(req.body);
    await mission.save();
    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du constat' });
  }
});

app.post('/api/missions/:id/remarks', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    mission.remarks.push(req.body);
    await mission.save();
    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la remarque' });
  }
});

app.post('/api/missions/:id/sanctions', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    mission.sanctions.push(req.body);
    await mission.save();
    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la sanction' });
  }
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('❌ Erreur globale:', err);
  res.status(500).json({ error: 'Une erreur est survenue sur le serveur' });
});

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
}); 