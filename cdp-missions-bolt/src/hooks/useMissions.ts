import { useState, useEffect } from 'react';
import { Mission } from '../types/mission';
import { PostgresService } from '../services/postgresService';
import { toast } from 'react-hot-toast';

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = async () => {
    try {
      const result = await PostgresService.getMissions();
      setMissions(result);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des missions:', err);
      setError('Erreur lors de la récupération des missions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const refreshMissions = () => {
    setLoading(true);
    fetchMissions();
  };

  const addMission = async (mission: Omit<Mission, 'id'>) => {
    try {
      const newMission = await PostgresService.createMission(mission);
      setMissions(prev => [newMission, ...prev]);
      toast.success('Mission ajoutée avec succès');
      return newMission;
    } catch (error) {
      toast.error(`Erreur lors de l'ajout de la mission: ${(error as Error).message}`);
      throw error;
    }
  };

  const updateMission = async (id: string, mission: Partial<Mission>) => {
    try {
      const updatedMission = await PostgresService.updateMission(id, mission);
      setMissions(prev => prev.map(m => m.id === id ? updatedMission : m));
      toast.success('Mission mise à jour avec succès');
      return updatedMission;
    } catch (error) {
      toast.error(`Erreur lors de la mise à jour: ${(error as Error).message}`);
      throw error;
    }
  };

  const deleteMission = async (id: string) => {
    try {
      await PostgresService.deleteMission(id);
      setMissions(prev => prev.filter(m => m.id !== id));
      toast.success('Mission supprimée avec succès');
    } catch (error) {
      toast.error(`Erreur lors de la suppression: ${(error as Error).message}`);
      throw error;
    }
  };

  const addRemark = async (missionId: string, remark: any) => {
    try {
      const result = await PostgresService.createRemark(remark);
      toast.success('Remarque ajoutée avec succès');
      return result;
    } catch (error) {
      toast.error(`Erreur lors de l'ajout de la remarque: ${(error as Error).message}`);
      throw error;
    }
  };

  const addSanction = async (missionId: string, sanction: any) => {
    try {
      const result = await PostgresService.createSanction(sanction);
      toast.success('Sanction ajoutée avec succès');
      return result;
    } catch (error) {
      toast.error(`Erreur lors de l'ajout de la sanction: ${(error as Error).message}`);
      throw error;
    }
  };

  const addFinding = async (missionId: string, finding: any) => {
    try {
      const result = await PostgresService.createFinding(finding);
      toast.success('Constat ajouté avec succès');
      return result;
    } catch (error) {
      toast.error(`Erreur lors de l'ajout du constat: ${(error as Error).message}`);
      throw error;
    }
  };

  return {
    missions,
    isLoading: loading,
    error,
    refetchMissions: refreshMissions,
    addMission,
    updateMission,
    deleteMission,
    addRemark,
    addSanction,
    addFinding,
    loading,
    localError: error,
    refreshMissions
  };
};