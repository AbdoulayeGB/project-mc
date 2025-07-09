const { supabaseService } = require('../services/supabaseService');

// Fonction pour générer une référence unique
const generateReference = (index) => {
  const year = new Date().getFullYear();
  return `MISSION-${year}-${String(index).padStart(3, '0')}`;
};

// Fonction pour générer une date aléatoire dans une plage
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Fonction pour formater une date en YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Liste des exemples de missions
const sampleMissions = [
  {
    reference: generateReference(1),
    title: "Audit de conformité de la loi 2008 du Sénégal portant sur la protection des données - CDP",
    description: "Mission d'audit de conformité à la loi 2008-08 du 25 janvier 2008 sur les transactions électroniques et la protection des données à caractère personnel au Sénégal. Évaluation de la mise en œuvre des dispositions de cette loi par les organismes publics et privés.",
    type_mission: "Contrôle sur place",
    organization: "Commission de Protection des Données Personnelles (CDP)",
    address: "Avenue de la République, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 1, 1), new Date(2024, 1, 15))),
    end_date: formatDate(getRandomDate(new Date(2024, 1, 16), new Date(2024, 2, 15))),
    status: "EN_COURS",
    motif_controle: "Suite a une plainte",
    team_members: ["Mamadou Diallo", "Fatou Sow", "Ibrahima Ndiaye"],
    objectives: [
      "Évaluer la conformité des traitements de données personnelles à la loi 2008-08",
      "Vérifier l'existence et la pertinence des mesures de sécurité",
      "Évaluer la mise en place des droits des personnes concernées",
      "Vérifier la désignation et le rôle des responsables de traitement",
      "Formuler des recommandations pour améliorer la conformité"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(2),
    title: "Audit de sécurité des données - Orange Sénégal",
    description: "Audit de sécurité des données personnelles chez Orange Sénégal. Évaluation des mesures de protection des données, des processus de gestion des incidents et de la conformité aux exigences réglementaires.",
    type_mission: "Contrôle sur place",
    organization: "Orange Sénégal",
    address: "Zone 12, Lot 1, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 4, 10), new Date(2024, 5, 10))),
    end_date: formatDate(getRandomDate(new Date(2024, 5, 11), new Date(2024, 6, 10))),
    status: "EN_COURS",
    motif_controle: "Suite a une plainte",
    team_members: ["Aminata Diop", "Omar Fall", "Moussa Diouf"],
    objectives: [
      "Évaluer les mesures de sécurité techniques",
      "Vérifier les processus de gestion des incidents de sécurité",
      "Évaluer la conformité aux exigences réglementaires",
      "Formuler des recommandations pour améliorer la sécurité"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(3),
    title: "Contrôle des sous-traitants - Expresso",
    description: "Contrôle de la conformité des sous-traitants d'Expresso aux exigences de protection des données personnelles. Évaluation des contrats, des garanties et des audits de sous-traitants.",
    type_mission: "Contrôle sur pièces",
    organization: "Expresso Telecom",
    address: "Rue de la République, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 3, 5), new Date(2024, 4, 5))),
    end_date: formatDate(getRandomDate(new Date(2024, 4, 6), new Date(2024, 5, 5))),
    status: "TERMINEE",
    motif_controle: "Decision de la session pleniere",
    decision_numero: "DEC-2024-003",
    date_decision: formatDate(getRandomDate(new Date(2024, 5, 6), new Date(2024, 5, 20))),
    team_members: ["Khady Mbaye", "Abdoulaye Gueye", "Mariama Diallo"],
    objectives: [
      "Vérifier la conformité des contrats de sous-traitance",
      "Évaluer les garanties fournies par les sous-traitants",
      "Vérifier les audits de sous-traitants",
      "Formuler des recommandations pour améliorer la conformité"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(4),
    title: "Évaluation des registres de traitement - Sonatel",
    description: "Évaluation des registres de traitement de données personnelles de Sonatel. Vérification de l'exhaustivité, de l'exactitude et de la mise à jour des registres.",
    type_mission: "Contrôle en ligne",
    organization: "Sonatel",
    address: "Avenue de la République, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 7, 1), new Date(2024, 7, 15))),
    end_date: formatDate(getRandomDate(new Date(2024, 7, 16), new Date(2024, 8, 15))),
    status: "PLANIFIEE",
    motif_controle: "Programme annuel",
    team_members: ["Moussa Diop", "Fatou Ndiaye", "Ibrahima Sall"],
    objectives: [
      "Vérifier l'exhaustivité des registres de traitement",
      "Évaluer l'exactitude des informations contenues dans les registres",
      "Vérifier la mise à jour régulière des registres",
      "Formuler des recommandations pour améliorer la qualité des registres"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(5),
    title: "Contrôle des droits des personnes - Tigo",
    description: "Contrôle de la mise en œuvre des droits des personnes concernées par le traitement de données personnelles chez Tigo. Évaluation des processus de réponse aux demandes d'accès, de rectification et d'effacement.",
    type_mission: "Contrôle sur place",
    organization: "Tigo Sénégal",
    address: "Zone industrielle de Rufisque, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 2, 1), new Date(2024, 2, 15))),
    end_date: formatDate(getRandomDate(new Date(2024, 2, 16), new Date(2024, 3, 15))),
    status: "TERMINEE",
    motif_controle: "Suite a une plainte",
    decision_numero: "DEC-2024-001",
    date_decision: formatDate(getRandomDate(new Date(2024, 3, 16), new Date(2024, 3, 30))),
    team_members: ["Aïda Fall", "Mamadou Ndiaye", "Khady Diop"],
    objectives: [
      "Évaluer les processus de réponse aux demandes d'accès aux données",
      "Vérifier les processus de rectification et d'effacement des données",
      "Évaluer les délais de réponse aux demandes",
      "Formuler des recommandations pour améliorer la gestion des droits des personnes"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(6),
    title: "Audit des transferts internationaux - BICIS",
    description: "Audit des transferts internationaux de données personnelles effectués par la Banque Internationale pour le Commerce et l'Industrie du Sénégal (BICIS). Évaluation des garanties et des mesures de sécurité.",
    type_mission: "Contrôle sur pièces",
    organization: "BICIS",
    address: "Place de l'Indépendance, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 8, 1), new Date(2024, 8, 15))),
    end_date: formatDate(getRandomDate(new Date(2024, 8, 16), new Date(2024, 9, 15))),
    status: "PLANIFIEE",
    motif_controle: "Programme annuel",
    team_members: ["Omar Diop", "Fatou Mbaye", "Ibrahima Diallo"],
    objectives: [
      "Vérifier la conformité des transferts internationaux de données",
      "Évaluer les garanties fournies pour les transferts",
      "Vérifier les mesures de sécurité mises en place",
      "Formuler des recommandations pour améliorer la conformité"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(7),
    title: "Contrôle des cookies et traceurs - Free",
    description: "Contrôle de la conformité de l'utilisation des cookies et autres traceurs sur le site web de Free Sénégal. Évaluation de l'information fournie aux utilisateurs et des mécanismes de consentement.",
    type_mission: "Contrôle en ligne",
    organization: "Free Sénégal",
    address: "Zone industrielle de Rufisque, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 1, 5), new Date(2024, 1, 20))),
    end_date: formatDate(getRandomDate(new Date(2024, 1, 21), new Date(2024, 2, 20))),
    status: "TERMINEE",
    motif_controle: "Suite a une plainte",
    decision_numero: "DEC-2024-002",
    date_decision: formatDate(getRandomDate(new Date(2024, 2, 21), new Date(2024, 3, 5))),
    team_members: ["Mariama Ndiaye", "Abdoulaye Sall", "Khady Gueye"],
    objectives: [
      "Évaluer l'information fournie aux utilisateurs sur les cookies",
      "Vérifier les mécanismes de consentement",
      "Évaluer la conformité des pratiques de collecte de données via les cookies",
      "Formuler des recommandations pour améliorer la conformité"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(8),
    title: "Audit de sécurité des données - Port de Dakar",
    description: "Audit de sécurité des données personnelles traitées par le Port de Dakar. Évaluation des mesures de protection des données, des processus de gestion des incidents et de la conformité aux exigences réglementaires.",
    type_mission: "Contrôle sur place",
    organization: "Port Autonome de Dakar",
    address: "Quai des Darses, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 9, 1), new Date(2024, 9, 15))),
    end_date: formatDate(getRandomDate(new Date(2024, 9, 16), new Date(2024, 10, 15))),
    status: "PLANIFIEE",
    motif_controle: "Programme annuel",
    team_members: ["Mamadou Gueye", "Fatou Diallo", "Ibrahima Mbaye"],
    objectives: [
      "Évaluer les mesures de sécurité techniques",
      "Vérifier les processus de gestion des incidents de sécurité",
      "Évaluer la conformité aux exigences réglementaires",
      "Formuler des recommandations pour améliorer la sécurité"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(9),
    title: "Contrôle des données de santé - Hôpital Principal",
    description: "Contrôle de la conformité au RGPD des traitements de données de santé à caractère personnel effectués par l'Hôpital Principal de Dakar. Évaluation des mesures de sécurité et de la confidentialité des données.",
    type_mission: "Contrôle sur place",
    organization: "Hôpital Principal de Dakar",
    address: "Place de l'Indépendance, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 10, 1), new Date(2024, 10, 15))),
    end_date: formatDate(getRandomDate(new Date(2024, 10, 16), new Date(2024, 11, 15))),
    status: "PLANIFIEE",
    motif_controle: "Programme annuel",
    team_members: ["Aminata Sall", "Omar Ndiaye", "Moussa Diop"],
    objectives: [
      "Évaluer les mesures de sécurité pour les données de santé",
      "Vérifier les processus de gestion des accès aux données",
      "Évaluer la confidentialité des données de santé",
      "Formuler des recommandations pour améliorer la protection des données de santé"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    reference: generateReference(10),
    title: "Contrôle des données biométriques - Aéroport International",
    description: "Contrôle de la conformité au RGPD des traitements de données biométriques effectués par l'Aéroport International de Dakar. Évaluation des mesures de sécurité et de la proportionnalité des traitements.",
    type_mission: "Contrôle sur place",
    organization: "Aéroport International de Dakar",
    address: "Aéroport International de Dakar, Dakar, Sénégal",
    start_date: formatDate(getRandomDate(new Date(2024, 11, 1), new Date(2024, 11, 15))),
    end_date: formatDate(getRandomDate(new Date(2024, 11, 16), new Date(2024, 12, 15))),
    status: "PLANIFIEE",
    motif_controle: "Programme annuel",
    team_members: ["Khady Sall", "Mamadou Ndiaye", "Fatou Gueye"],
    objectives: [
      "Évaluer la proportionnalité des traitements de données biométriques",
      "Vérifier les mesures de sécurité pour les données biométriques",
      "Évaluer les délais de conservation des données biométriques",
      "Formuler des recommandations pour améliorer la conformité"
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Fonction pour insérer les missions
const insertSampleMissions = async () => {
  console.log("Début de l'insertion des missions d'exemple...");
  
  for (const mission of sampleMissions) {
    try {
      console.log(`Insertion de la mission: ${mission.reference}`);
      await supabaseService.createMission(mission);
      console.log(`Mission ${mission.reference} insérée avec succès`);
    } catch (error) {
      console.error(`Erreur lors de l'insertion de la mission ${mission.reference}:`, error);
    }
  }
  
  console.log("Fin de l'insertion des missions d'exemple");
};

// Exécuter la fonction
insertSampleMissions(); 