import { Mission } from '../types/mission';
import { supabase } from '../config/supabase';

export const supabaseService = {
  // Récupérer toutes les missions
  getMissions: async (): Promise<Mission[]> => {
    try {
      console.log('🔄 Début de la récupération des missions...');
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          findings (*),
          remarks (*),
          sanctions (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des missions:', error);
        console.error('Détails de l\'erreur:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return [];
      }

      console.log('✅ Missions récupérées avec succès');
      console.log('📊 Nombre de missions:', data?.length || 0);
      console.log('📝 Données des missions:', data);
      
      return data || [];
    } catch (error) {
      console.error('❌ Erreur dans getMissions:', error);
      return [];
    }
  },

  // Créer une nouvelle mission
  createMission: async (mission: Omit<Mission, 'id'>): Promise<Mission> => {
    try {
      console.log('🔄 Début de la création de la mission');
      console.log('📝 Données reçues:', mission);

      // Validation des champs requis
      const requiredFields = [
        'reference', 'title', 'description', 'type_mission',
        'organization', 'address', 'start_date', 'end_date',
        'status', 'motif_controle'
      ];

      const missingFields = requiredFields.filter(field => !mission[field as keyof typeof mission]);
      if (missingFields.length > 0) {
        throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
      }

      // Formatage des dates
      const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return null;
        try {
          const date = new Date(dateStr);
          return date.toISOString();
        } catch (error) {
          console.error('❌ Erreur de formatage de date:', error);
          return null;
        }
      };

      // Préparation des données
      const missionData = {
        ...mission,
        start_date: formatDate(mission.start_date),
        end_date: formatDate(mission.end_date),
        team_members: Array.isArray(mission.team_members) 
          ? mission.team_members 
          : mission.team_members?.split(',').map(m => m.trim()).filter(Boolean) || [],
        objectives: Array.isArray(mission.objectives)
          ? mission.objectives
          : mission.objectives?.split('\n').map(o => o.trim()).filter(Boolean) || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Données formatées:', missionData);

      // Envoi à Supabase
      const { data, error } = await supabase
        .from('missions')
        .insert([missionData])
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur Supabase lors de la création:', error);
        console.error('Détails de l\'erreur:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        console.error('Données envoyées:', missionData);
        throw new Error(`Erreur lors de la création de la mission: ${error.message}`);
      }

      console.log('✅ Mission créée avec succès:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur dans createMission:', error);
      throw error;
    }
  },

  // Mettre à jour une mission
  updateMission: async (id: string, mission: Partial<Mission>): Promise<Mission> => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .update({
          ...mission,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur dans updateMission:', error);
      throw error;
    }
  },

  // Supprimer une mission
  deleteMission: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur dans deleteMission:', error);
      throw error;
    }
  },

  // Ajouter un constat
  addFinding: async (missionId: string, finding: any): Promise<Mission> => {
    try {
      const { data, error } = await supabase
        .from('findings')
        .insert({
          mission_id: missionId,
          ...finding,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur dans addFinding:', error);
      throw error;
    }
  },

  // Ajouter une remarque
  addRemark: async (missionId: string, remark: any): Promise<Mission> => {
    try {
      const { data, error } = await supabase
        .from('remarks')
        .insert({
          mission_id: missionId,
          ...remark,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur dans addRemark:', error);
      throw error;
    }
  },

  // Ajouter une sanction
  addSanction: async (missionId: string, sanction: any): Promise<Mission> => {
    try {
      const { data, error } = await supabase
        .from('sanctions')
        .insert({
          mission_id: missionId,
          ...sanction,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur dans addSanction:', error);
      throw error;
    }
  }
}; 