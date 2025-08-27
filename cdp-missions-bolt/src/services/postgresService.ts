import { pool } from '../config/database';
import { Mission } from '../types/mission';
import { User } from '../types/auth';

export class PostgresService {
  // Missions
  static async getMissions(): Promise<Mission[]> {
    try {
      const result = await pool.query(`
        SELECT * FROM missions 
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des missions:', error);
      return [];
    }
  }

  static async getMissionById(id: string): Promise<Mission | null> {
    try {
      const result = await pool.query(`
        SELECT * FROM missions WHERE id = $1
      `, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la mission:', error);
      return null;
    }
  }

  static async createMission(mission: Omit<Mission, 'id' | 'created_at' | 'updated_at'>): Promise<Mission> {
    try {
      const result = await pool.query(`
        INSERT INTO missions (
          reference, title, description, type_mission, organization, 
          address, start_date, end_date, status, motif_controle, 
          decision_numero, date_decision, team_members, objectives, 
          assigned_to, created_by, ignore_auto_status_change
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `, [
        mission.reference,
        mission.title,
        mission.description,
        mission.type_mission,
        mission.organization,
        mission.address,
        mission.start_date,
        mission.end_date,
        mission.status,
        mission.motif_controle,
        mission.decision_numero,
        mission.date_decision,
        mission.team_members,
        mission.objectives,
        mission.assigned_to || null,
        mission.created_by || null,
        mission.ignoreAutoStatusChange || false
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de la mission:', error);
      throw error;
    }
  }

  static async updateMission(id: string, updates: Partial<Mission>): Promise<Mission> {
    try {
      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
      const values = Object.values(updates);
      
      const result = await pool.query(`
        UPDATE missions 
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, ...values]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la mission:', error);
      throw error;
    }
  }

  static async deleteMission(id: string): Promise<void> {
    try {
      await pool.query('DELETE FROM missions WHERE id = $1', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression de la mission:', error);
      throw error;
    }
  }

  // Users
  static async getUsers(): Promise<User[]> {
    try {
      const result = await pool.query(`
        SELECT * FROM users 
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par email:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par ID:', error);
      throw error;
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password?: string }): Promise<User> {
    try {
      const result = await pool.query(`
        INSERT INTO users (email, name, role, is_active, department, phone, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        userData.email,
        userData.name,
        userData.role,
        userData.is_active,
        userData.department,
        userData.phone,
        userData.password || ''
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  static async updateUserPassword(id: string, passwordHash: string): Promise<void> {
    try {
      await pool.query(`
        UPDATE users 
        SET password_hash = $2, updated_at = NOW()
        WHERE id = $1
      `, [id, passwordHash]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      throw error;
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
      const values = Object.values(updates);
      
      const result = await pool.query(`
        UPDATE users 
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, ...values]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  // Documents
  static async getDocuments(missionId: string) {
    try {
      const result = await pool.query(`
        SELECT * FROM documents 
        WHERE mission_id = $1
        ORDER BY created_at DESC
      `, [missionId]);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      return [];
    }
  }

  static async createDocument(documentData: any) {
    try {
      const result = await pool.query(`
        INSERT INTO documents (mission_id, title, type, file_path, file_size, mime_type, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        documentData.mission_id,
        documentData.title,
        documentData.type,
        documentData.file_path,
        documentData.file_size,
        documentData.mime_type,
        documentData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      throw error;
    }
  }

  static async deleteDocument(id: string): Promise<void> {
    try {
      await pool.query('DELETE FROM documents WHERE id = $1', [id]);
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      throw error;
    }
  }

  // Findings
  static async getFindings(missionId: string) {
    try {
      const result = await pool.query(`
        SELECT * FROM findings 
        WHERE mission_id = $1
        ORDER BY created_at DESC
      `, [missionId]);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des constats:', error);
      return [];
    }
  }

  static async createFinding(findingData: any) {
    try {
      const result = await pool.query(`
        INSERT INTO findings (mission_id, type, description, severity, recommendation, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        findingData.mission_id,
        findingData.type,
        findingData.description,
        findingData.severity,
        findingData.recommendation,
        findingData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création du constat:', error);
      throw error;
    }
  }

  // Sanctions
  static async getSanctions(missionId: string) {
    try {
      const result = await pool.query(`
        SELECT * FROM sanctions 
        WHERE mission_id = $1
        ORDER BY created_at DESC
      `, [missionId]);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des sanctions:', error);
      return [];
    }
  }

  static async createSanction(sanctionData: any) {
    try {
      const result = await pool.query(`
        INSERT INTO sanctions (mission_id, type, description, amount, decision_date, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        sanctionData.mission_id,
        sanctionData.type,
        sanctionData.description,
        sanctionData.amount,
        sanctionData.decision_date,
        sanctionData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de la sanction:', error);
      throw error;
    }
  }

  // Remarks
  static async getRemarks(missionId: string) {
    try {
      const result = await pool.query(`
        SELECT * FROM remarks 
        WHERE mission_id = $1
        ORDER BY created_at DESC
      `, [missionId]);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des remarques:', error);
      return [];
    }
  }

  static async createRemark(remarkData: any) {
    try {
      const result = await pool.query(`
        INSERT INTO remarks (mission_id, content, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [
        remarkData.mission_id,
        remarkData.content,
        remarkData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de la remarque:', error);
      throw error;
    }
  }

  // Statistics
  static async getStatistics() {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours,
          COUNT(CASE WHEN status = 'planifiee' THEN 1 END) as planifiee,
          COUNT(CASE WHEN status = 'terminee' THEN 1 END) as terminee
        FROM missions
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return { total: 0, en_cours: 0, planifiee: 0, terminee: 0 };
    }
  }

  // Update mission statuses
  static async updateMissionStatuses() {
    try {
      const now = new Date().toISOString();
      
      // Mettre à jour les missions qui doivent commencer
      const startResult = await pool.query(`
        UPDATE missions 
        SET status = 'en_cours', updated_at = NOW()
        WHERE status = 'planifiee' AND start_date <= $1
        RETURNING id
      `, [now]);

      // Mettre à jour les missions qui doivent se terminer
      const endResult = await pool.query(`
        UPDATE missions 
        SET status = 'terminee', updated_at = NOW()
        WHERE status = 'en_cours' AND end_date <= $1
        RETURNING id
      `, [now]);

      const updated = (startResult.rowCount || 0) + (endResult.rowCount || 0);
      return { updated };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statuts:', error);
      return { updated: 0 };
    }
  }
}
