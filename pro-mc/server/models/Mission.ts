const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type_mission: { type: String, required: true },
  organization: { type: String, required: true },
  address: { type: String, required: true },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  status: { type: String, required: true },
  motif_controle: { type: String, required: true },
  decision_numero: { type: String, required: false },
  date_decision: { type: String, required: false },
  team_members: [{ type: String }],
  objectives: [{ type: String }],
  findings: [{
    type: { type: String },
    description: { type: String },
    reference_legale: { type: String },
    recommandation: { type: String },
    delai_correction: { type: Number },
    date_constat: { type: String },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() }
  }],
  remarks: [{
    content: { type: String },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() }
  }],
  sanctions: [{
    type: { type: String },
    description: { type: String },
    decision_date: { type: String },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() }
  }],
  created_at: { type: String, default: () => new Date().toISOString() },
  updated_at: { type: String, default: () => new Date().toISOString() }
});

// Middleware pour mettre à jour updated_at avant chaque sauvegarde
missionSchema.pre('save', function(next) {
  this.updated_at = new Date().toISOString();
  next();
});

const Mission = mongoose.model('Mission', missionSchema);

module.exports = { Mission }; 