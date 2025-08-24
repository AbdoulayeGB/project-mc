import { createClient } from '@supabase/supabase-js';
import { Mission, User } from '../types/mission';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SupabaseService {
  // Authentification
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return user;
  }

  // Missions
  static async getMissions(): Promise<Mission[]> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des missions: ${error.message}`);
    }

    return data || [];
  }

  static async getMissionById(id: string): Promise<Mission | null> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erreur lors de la récupération de la mission: ${error.message}`);
    }

    return data;
  }

  static async createMission(mission: Omit<Mission, 'id' | 'created_at' | 'updated_at'>): Promise<Mission> {
    const { data, error } = await supabase
      .from('missions')
      .insert({
        ...mission,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de la mission: ${error.message}`);
    }

    return data;
  }

  static async updateMission(id: string, updates: Partial<Mission>): Promise<Mission> {
    const { data, error } = await supabase
      .from('missions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la mise à jour de la mission: ${error.message}`);
    }

    return data;
  }

  static async deleteMission(id: string): Promise<void> {
    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression de la mission: ${error.message}`);
    }
  }

  // Utilisateurs
  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }

    return data || [];
  }

  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    }

    return data;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
    }

    return data;
  }

  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
    }
  }

  // Documents
  static async getDocuments(missionId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('mission_id', missionId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des documents: ${error.message}`);
    }

    return data || [];
  }

  static async createDocument(documentData: any) {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        ...documentData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création du document: ${error.message}`);
    }

    return data;
  }

  static async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression du document: ${error.message}`);
    }
  }

  // Constatations
  static async getFindings(missionId: string) {
    const { data, error } = await supabase
      .from('findings')
      .select('*')
      .eq('mission_id', missionId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des constatations: ${error.message}`);
    }

    return data || [];
  }

  static async createFinding(findingData: any) {
    const { data, error } = await supabase
      .from('findings')
      .insert({
        ...findingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de la constatation: ${error.message}`);
    }

    return data;
  }

  // Sanctions
  static async getSanctions(missionId: string) {
    const { data, error } = await supabase
      .from('sanctions')
      .select('*')
      .eq('mission_id', missionId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des sanctions: ${error.message}`);
    }

    return data || [];
  }

  static async createSanction(sanctionData: any) {
    const { data, error } = await supabase
      .from('sanctions')
      .insert({
        ...sanctionData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de la sanction: ${error.message}`);
    }

    return data;
  }

  // Remarques
  static async getRemarks(missionId: string) {
    const { data, error } = await supabase
      .from('remarks')
      .select('*')
      .eq('mission_id', missionId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des remarques: ${error.message}`);
    }

    return data || [];
  }

  static async createRemark(remarkData: any) {
    const { data, error } = await supabase
      .from('remarks')
      .insert({
        ...remarkData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de la remarque: ${error.message}`);
    }

    return data;
  }

  // Mise à jour automatique des statuts
  static async updateMissionStatuses() {
    const now = new Date().toISOString().split('T')[0];

    // Missions planifiées qui doivent passer en cours
    const { data: plannedMissions, error: plannedError } = await supabase
      .from('missions')
      .update({ 
        status: 'EN_COURS',
        updated_at: new Date().toISOString()
      })
      .eq('status', 'PLANIFIEE')
      .lte('start_date', now)
      .select('id');

    if (plannedError) {
      throw new Error(`Erreur lors de la mise à jour des missions planifiées: ${plannedError.message}`);
    }

    // Missions en cours qui doivent se terminer
    const { data: ongoingMissions, error: ongoingError } = await supabase
      .from('missions')
      .update({ 
        status: 'TERMINEE',
        updated_at: new Date().toISOString()
      })
      .eq('status', 'EN_COURS')
      .lte('end_date', now)
      .select('id');

    if (ongoingError) {
      throw new Error(`Erreur lors de la mise à jour des missions en cours: ${ongoingError.message}`);
    }

    return {
      plannedToOngoing: plannedMissions?.length || 0,
      ongoingToCompleted: ongoingMissions?.length || 0
    };
  }

  // Statistiques
  static async getStatistics() {
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('status');

    if (missionsError) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${missionsError.message}`);
    }

    const stats = {
      total: missions?.length || 0,
      planifiees: missions?.filter(m => m.status === 'PLANIFIEE').length || 0,
      enCours: missions?.filter(m => m.status === 'EN_COURS').length || 0,
      terminees: missions?.filter(m => m.status === 'TERMINEE').length || 0,
      annulees: missions?.filter(m => m.status === 'ANNULEE').length || 0
    };

    return stats;
  }
} 