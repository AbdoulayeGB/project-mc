import React, { useState } from 'react';
import { Mission, Finding } from '../types/mission';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, UsersIcon, ChatBubbleLeftIcon, ExclamationTriangleIcon, ChevronDownIcon, ChevronRightIcon, DocumentIcon, BuildingOfficeIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ClockIcon as ClockIconSolid } from '@heroicons/react/24/outline';
import { MissionDetails } from './MissionDetails';
import { toast } from 'react-hot-toast';
import { useLocalMissions } from '../hooks/useLocalMissions';
import { db } from '../database/localStorageDb';

export const MissionList: React.FC = () => {
  const { missions, loading, error, refreshMissions } = useLocalMissions();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [newRemark, setNewRemark] = useState('');
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);

  console.log('🔄 MissionList - Missions reçues:', missions);
  console.log('📊 Nombre de missions:', missions?.length || 0);

  const handleAddRemark = async (missionId: string, content: string) => {
    if (!content.trim()) {
      toast.error('Veuillez saisir une remarque');
      return;
    }
    try {
      await db.addRemark(missionId, content);
      setNewRemark('');
      toast.success('Remarque ajoutée avec succès');
      refreshMissions();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la remarque:', error);
      toast.error('Erreur lors de l\'ajout de la remarque');
    }
  };

  const handleDeleteMission = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette mission?')) {
      try {
        await db.deleteMission(id);
        toast.success('Mission supprimée avec succès');
        refreshMissions();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la mission');
      }
    }
  };

  const handleAddSanction = async (missionId: string, content: string) => {
    try {
      await db.addSanction(missionId, content);
      toast.success('Sanction ajoutée avec succès');
      refreshMissions();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la sanction:', error);
      toast.error('Erreur lors de l\'ajout de la sanction');
    }
  };

  const handleAddFinding = async (missionId: string, finding: string | Omit<Finding, "id" | "mission_id" | "created_at" | "updated_at">) => {
    try {
      await db.addFinding(missionId, typeof finding === 'string' ? finding : JSON.stringify(finding));
      toast.success('Constat ajouté avec succès');
      refreshMissions();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du constat:', error);
      toast.error('Erreur lors de l\'ajout du constat');
    }
  };

  const toggleStatus = (status: string) => {
    setExpandedStatus(expandedStatus === status ? null : status);
  };

  // Grouper les missions par statut
  const missionsByStatus: Record<string, Mission[]> = {};
  missions.forEach(mission => {
    if (!missionsByStatus[mission.status]) {
      missionsByStatus[mission.status] = [];
    }
    missionsByStatus[mission.status].push(mission);
  });

  // Ordre d'affichage des statuts
  const statusOrder = ['PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ATTENTE_REPONSE', 'ANNULEE'];

  // Labels des statuts
  const statusLabels: Record<string, string> = {
    'PLANIFIEE': 'Missions à venir',
    'EN_COURS': 'Missions en cours',
    'TERMINEE': 'Missions terminées',
    'ATTENTE_REPONSE': 'En attente de réponse',
    'ANNULEE': 'Missions annulées'
  };

  // Couleurs des statuts
  const statusColors: Record<string, { bg: string, text: string, border: string }> = {
    'PLANIFIEE': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'EN_COURS': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'TERMINEE': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'ATTENTE_REPONSE': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'ANNULEE': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
  };

  // Icônes des statuts
  const statusIcons: Record<string, React.ReactNode> = {
    'PLANIFIEE': <CalendarIcon className="h-5 w-5 text-blue-500" />,
    'EN_COURS': <ClockIcon className="h-5 w-5 text-yellow-500" />,
    'TERMINEE': <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    'ATTENTE_REPONSE': <ClockIconSolid className="h-5 w-5 text-purple-500" />,
    'ANNULEE': <XCircleIcon className="h-5 w-5 text-red-500" />
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Liste des missions de contrôle</h1>
      
      {statusOrder.map(status => {
        const statusMissions = missionsByStatus[status] || [];
        if (statusMissions.length === 0) return null;

        const isExpanded = expandedStatus === status;
        const statusColor = statusColors[status];

        return (
          <div key={status} className="mb-6">
            <div 
              className={`${statusColor.bg} ${statusColor.border} rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-colors flex justify-between items-center border-l-4 ${statusColor.border}`}
              onClick={() => toggleStatus(status)}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  {statusIcons[status]}
                </div>
                <h2 className={`text-xl font-bold ${statusColor.text}`}>
                  {statusLabels[status]} ({statusMissions.length})
                </h2>
              </div>
              {isExpanded ? (
                <ChevronDownIcon className={`h-6 w-6 ${statusColor.text}`} />
              ) : (
                <ChevronRightIcon className={`h-6 w-6 ${statusColor.text}`} />
              )}
            </div>

            {isExpanded && (
              <div className="mt-2 space-y-4">
                {statusMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{mission.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">Référence: {mission.reference}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedMission(mission)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Voir les détails"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMission(mission.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Supprimer la mission"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-start">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Organisation</p>
                            <p className="text-sm text-gray-600">{mission.organization}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Adresse</p>
                            <p className="text-sm text-gray-600">{mission.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Période</p>
                            <p className="text-sm text-gray-600">
                              Du {format(new Date(mission.start_date), 'dd/MM/yyyy', { locale: fr })} au {format(new Date(mission.end_date), 'dd/MM/yyyy', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <UsersIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Équipe</p>
                            <p className="text-sm text-gray-600">
                              {Array.isArray(mission.team_members) 
                                ? mission.team_members.join(', ') 
                                : mission.team_members || 'Non spécifiée'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {mission.documents && mission.documents.length > 0 && (
                            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                              <DocumentIcon className="h-4 w-4 mr-1" />
                              {mission.documents.length} document{mission.documents.length > 1 ? 's' : ''}
                            </div>
                          )}
                          
                          {mission.findings && mission.findings.length > 0 && (
                            <div className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs">
                              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                              {mission.findings.length} constat{mission.findings.length > 1 ? 's' : ''}
                            </div>
                          )}
                          
                          {mission.remarks && mission.remarks.length > 0 && (
                            <div className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs">
                              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                              {mission.remarks.length} remarque{mission.remarks.length > 1 ? 's' : ''}
                            </div>
                          )}
                          
                          {mission.sanctions && mission.sanctions.length > 0 && (
                            <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
                              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                              {mission.sanctions.length} sanction{mission.sanctions.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {selectedMission && (
        <MissionDetails
          mission={selectedMission}
          onAddRemark={handleAddRemark}
          onAddSanction={handleAddSanction}
          onAddFinding={handleAddFinding}
          onUpdate={refreshMissions}
        />
      )}
    </div>
  );
};