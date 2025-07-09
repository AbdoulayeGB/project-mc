import { Mission } from '../types/mission';

const API_URL = 'http://localhost:3000/api';

export const missionService = {
  // Récupérer toutes les missions
  getMissions: async (): Promise<Mission[]> => {
    try {
      console.log('Récupération des missions...');
      const response = await fetch(`${API_URL}/missions`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log('Missions reçues:', data);
      return data;
    } catch (error) {
      console.error('Erreur dans getMissions:', error);
      throw error;
    }
  },

  // Récupérer une mission par son ID
  getMissionById: async (id: string): Promise<Mission> => {
    try {
      console.log('Récupération de la mission:', id);
      const response = await fetch(`${API_URL}/missions/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log('Mission reçue:', data);
      return data;
    } catch (error) {
      console.error('Erreur dans getMissionById:', error);
      throw error;
    }
  },

  // Créer une nouvelle mission
  createMission: async (missionData: Partial<Mission>): Promise<Mission> => {
    try {
      console.log('Tentative de création de la mission:', missionData);

      // Préparation des données
      const mission = {
        ...missionData,
        team_members: Array.isArray(missionData.team_members) 
          ? missionData.team_members 
          : missionData.team_members?.split(',').map(m => m.trim()).filter(Boolean) || [],
        objectives: Array.isArray(missionData.objectives)
          ? missionData.objectives
          : missionData.objectives?.split('\n').map(o => o.trim()).filter(Boolean) || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Envoi de la requête
      const response = await fetch(`${API_URL}/missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(mission)
      });

      console.log('Statut de la réponse:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur du serveur:', errorData);
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Mission créée avec succès:', data);
      return data;
    } catch (error: any) {
      console.error('Erreur dans createMission:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le serveur backend est en cours d\'exécution.');
      }
      throw error;
    }
  },

  // Mettre à jour une mission
  updateMission: async (id: string, mission: Partial<Mission>): Promise<Mission> => {
    try {
      const response = await fetch(`${API_URL}/missions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(mission)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Mission mise à jour:', data);
      return data;
    } catch (error) {
      console.error('Erreur dans updateMission:', error);
      throw error;
    }
  },

  // Supprimer une mission
  deleteMission: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/missions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur dans deleteMission:', error);
      throw error;
    }
  },

  // Ajouter un constat à une mission
  addFinding: async (missionId: string, finding: any): Promise<Mission> => {
    const response = await fetch(`${API_URL}/missions/${missionId}/findings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finding),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du constat');
    }
    return response.json();
  },

  // Ajouter une remarque à une mission
  addRemark: async (missionId: string, remark: any): Promise<Mission> => {
    const response = await fetch(`${API_URL}/missions/${missionId}/remarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(remark),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout de la remarque');
    }
    return response.json();
  },

  // Ajouter une sanction à une mission
  addSanction: async (missionId: string, sanction: any): Promise<Mission> => {
    const response = await fetch(`${API_URL}/missions/${missionId}/sanctions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanction),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout de la sanction');
    }
    return response.json();
  }
}; 