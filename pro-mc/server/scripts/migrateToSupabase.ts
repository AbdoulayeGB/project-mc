import { createClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';
import { Mission } from '../models/Mission';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = 'mongodb://localhost:27017/cdp-missions';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrateData() {
  try {
    // Connexion à MongoDB
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupération des missions
    console.log('Récupération des missions...');
    const missions = await Mission.find();
    console.log(`✅ ${missions.length} missions trouvées`);

    // Migration vers Supabase
    console.log('Migration vers Supabase...');
    
    for (const mission of missions) {
      // Migration de la mission principale
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .insert({
          title: mission.title,
          description: mission.description,
          start_date: mission.start_date,
          end_date: mission.end_date,
          status: mission.status,
          organization: mission.organization,
          address: mission.address,
          team_members: mission.team_members,
          objectives: mission.objectives,
          created_at: mission.created_at,
          updated_at: mission.updated_at
        })
        .select()
        .single();

      if (missionError) {
        console.error(`❌ Erreur lors de la migration de la mission ${mission._id}:`, missionError);
        continue;
      }

      // Migration des constats
      if (mission.findings && mission.findings.length > 0) {
        for (const finding of mission.findings) {
          const { error: findingError } = await supabase
            .from('findings')
            .insert({
              mission_id: missionData.id,
              type: finding.type,
              description: finding.description,
              reference_legale: finding.reference_legale,
              recommandation: finding.recommandation,
              delai_correction: finding.delai_correction,
              date_constat: finding.date_constat,
              created_at: finding.created_at,
              updated_at: finding.updated_at
            });

          if (findingError) {
            console.error(`❌ Erreur lors de la migration du constat pour la mission ${mission._id}:`, findingError);
          }
        }
      }

      // Migration des remarques
      if (mission.remarks && mission.remarks.length > 0) {
        for (const remark of mission.remarks) {
          const { error: remarkError } = await supabase
            .from('remarks')
            .insert({
              mission_id: missionData.id,
              content: remark.content,
              created_at: remark.created_at,
              updated_at: remark.updated_at
            });

          if (remarkError) {
            console.error(`❌ Erreur lors de la migration de la remarque pour la mission ${mission._id}:`, remarkError);
          }
        }
      }

      // Migration des sanctions
      if (mission.sanctions && mission.sanctions.length > 0) {
        for (const sanction of mission.sanctions) {
          const { error: sanctionError } = await supabase
            .from('sanctions')
            .insert({
              mission_id: missionData.id,
              type: sanction.type,
              description: sanction.description,
              decision_date: sanction.decision_date,
              created_at: sanction.created_at,
              updated_at: sanction.updated_at
            });

          if (sanctionError) {
            console.error(`❌ Erreur lors de la migration de la sanction pour la mission ${mission._id}:`, sanctionError);
          }
        }
      }
    }

    console.log('✅ Migration terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateData(); 