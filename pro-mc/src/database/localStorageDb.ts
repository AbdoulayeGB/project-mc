import { Mission, Document, ReponseSuivi, Sanction, Remark, Finding } from '../types/mission';
import Dexie, { Table } from 'dexie';

class LocalStorageDatabase extends Dexie {
  missions!: Table<Mission>;
  remarks!: Table<Remark>;
  findings!: Table<Finding>;
  sanctions!: Table<Sanction>;
  documents!: Table<Document>;

  constructor() {
    super('MissionDatabase');
    this.version(1).stores({
      missions: '++id, reference, title, status, organization, start_date, end_date, type_mission, motif_controle',
      remarks: '++id, mission_id, content, created_at, updated_at',
      findings: '++id, mission_id, type, description, date_constat, created_at, updated_at',
      sanctions: '++id, mission_id, type, description, decision_date, amount, created_at, updated_at',
      documents: '++id, mission_id, title, type, file_path, created_at'
    });
  }

  // Missions
  async getAllMissions(): Promise<Mission[]> {
    return await this.missions.toArray();
  }

  async addMission(mission: Omit<Mission, 'id'>): Promise<Mission> {
    const id = await this.missions.add({
      ...mission,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return { ...mission, id: id.toString() };
  }

  async updateMission(id: string, data: Partial<Mission>): Promise<void> {
    await this.missions.update(id, {
      ...data,
      updated_at: new Date().toISOString()
    });
  }

  async deleteMission(id: string): Promise<void> {
    await this.missions.delete(id);
    // Supprimer également les données associées
    await this.remarks.where('mission_id').equals(id).delete();
    await this.findings.where('mission_id').equals(id).delete();
    await this.sanctions.where('mission_id').equals(id).delete();
    await this.documents.where('mission_id').equals(id).delete();
  }

  // Remarques
  async addRemark(missionId: string, content: string): Promise<void> {
    await this.remarks.add({
      id: Date.now().toString(),
      mission_id: missionId,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async getRemarksForMission(missionId: string): Promise<Remark[]> {
    return await this.remarks.where('mission_id').equals(missionId).toArray();
  }

  // Findings
  async addFinding(missionId: string, finding: Omit<Finding, 'id' | 'mission_id'>): Promise<void> {
    await this.findings.add({
      id: Date.now().toString(),
      mission_id: missionId,
      ...finding,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async getFindingsForMission(missionId: string): Promise<Finding[]> {
    return await this.findings.where('mission_id').equals(missionId).toArray();
  }

  // Sanctions
  async addSanction(missionId: string, sanction: Omit<Sanction, 'id' | 'mission_id'>): Promise<void> {
    await this.sanctions.add({
      id: Date.now().toString(),
      mission_id: missionId,
      ...sanction,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async getSanctionsForMission(missionId: string): Promise<Sanction[]> {
    return await this.sanctions.where('mission_id').equals(missionId).toArray();
  }

  // Documents
  async addDocument(missionId: string, document: Omit<Document, 'id' | 'mission_id'>): Promise<void> {
    await this.documents.add({
      id: Date.now().toString(),
      mission_id: missionId,
      ...document,
      created_at: new Date().toISOString()
    });
  }

  async getDocumentsForMission(missionId: string): Promise<Document[]> {
    return await this.documents.where('mission_id').equals(missionId).toArray();
  }

  // Réponses de suivi
  async addReponseSuivi(missionId: string, reponse: ReponseSuivi): Promise<void> {
    const mission = await this.missions.get(missionId);
    if (!mission) throw new Error('Mission non trouvée');

    mission.reponses_suivi = mission.reponses_suivi || [];
    mission.reponses_suivi.push(reponse);
    await this.missions.put(mission);
  }

  async updateMissionReponseStatus(missionId: string, reponseRecue: boolean, dateReponse?: string): Promise<void> {
    const mission = await this.missions.get(missionId);
    if (!mission) throw new Error('Mission non trouvée');

    mission.reponse_recue = reponseRecue;
    if (dateReponse) {
      mission.date_derniere_reponse = dateReponse;
    }
    mission.updated_at = new Date().toISOString();

    await this.missions.put(mission);
  }

  // Initialisation avec des données d'exemple
  async initializeWithSampleData(sampleMissions: Omit<Mission, 'id'>[]): Promise<void> {
    await this.delete();
    await this.open();
    for (const mission of sampleMissions) {
      await this.addMission(mission);
    }
  }
}

export const db = new LocalStorageDatabase(); 