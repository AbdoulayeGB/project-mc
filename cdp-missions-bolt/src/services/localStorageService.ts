import { Mission } from '../types/mission';

// Service localStorage simple pour remplacer localStorageDb
export const db = {
  // Missions
  async getMissions(): Promise<Mission[]> {
    const stored = localStorage.getItem('missions');
    return stored ? JSON.parse(stored) : [];
  },

  async getAllMissions(): Promise<Mission[]> {
    return this.getMissions();
  },

  async saveMission(mission: Mission): Promise<void> {
    const missions = await this.getMissions();
    const index = missions.findIndex(m => m.id === mission.id);
    if (index >= 0) {
      missions[index] = mission;
    } else {
      missions.push(mission);
    }
    localStorage.setItem('missions', JSON.stringify(missions));
  },

  async updateMission(id: string, updates: Partial<Mission>): Promise<void> {
    const missions = await this.getMissions();
    const index = missions.findIndex(m => m.id === id);
    if (index >= 0) {
      missions[index] = { ...missions[index], ...updates };
      localStorage.setItem('missions', JSON.stringify(missions));
    }
  },

  async deleteMission(id: string): Promise<void> {
    const missions = await this.getMissions();
    const filtered = missions.filter(m => m.id !== id);
    localStorage.setItem('missions', JSON.stringify(filtered));
  },

  // Documents
  async getDocuments(missionId: string): Promise<any[]> {
    const stored = localStorage.getItem(`documents_${missionId}`);
    return stored ? JSON.parse(stored) : [];
  },

  async saveDocument(missionId: string, document: any): Promise<void> {
    const documents = await this.getDocuments(missionId);
    documents.push(document);
    localStorage.setItem(`documents_${missionId}`, JSON.stringify(documents));
  },

  async deleteDocument(missionId: string, documentId: string): Promise<void> {
    const documents = await this.getDocuments(missionId);
    const filtered = documents.filter(d => d.id !== documentId);
    localStorage.setItem(`documents_${missionId}`, JSON.stringify(filtered));
  },

  // Status updates
  async updateMissionStatuses(): Promise<{ updated: number }> {
    return { updated: 0 };
  },

  async checkUpcomingStatusChanges(): Promise<{ startingSoon: Mission[], endingSoon: Mission[] }> {
    return { startingSoon: [], endingSoon: [] };
  }
};
