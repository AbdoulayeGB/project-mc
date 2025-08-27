import React, { useState, useEffect } from 'react';
import { PostgresService } from '../services/postgresService';
import { authService } from '../services/authService';
import { User } from '../types/auth';
import { toast } from 'react-hot-toast';

interface UserSyncStatusProps {
  onRefresh?: () => void;
}

export const UserSyncStatus: React.FC<UserSyncStatusProps> = ({ onRefresh }) => {
  const [postgresUsers, setPostgresUsers] = useState<User[]>([]);
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Charger les utilisateurs depuis PostgreSQL
      const pgUsers = await PostgresService.getUsers();
      setPostgresUsers(pgUsers);

      // Charger les utilisateurs locaux depuis le service d'authentification
      const localUsersData = await authService.getUsers();
      setLocalUsers(localUsersData);

      // Vérifier la dernière synchronisation
      const lastSyncTime = localStorage.getItem('lastUserSync');
      setLastSync(lastSyncTime);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const syncUsers = async () => {
    setSyncing(true);
    try {
      // Synchroniser les utilisateurs locaux avec PostgreSQL
      await authService.loadUsers();
      
      // Mettre à jour la liste des utilisateurs
      await loadUsers();
      
      // Enregistrer le timestamp de synchronisation
      const now = new Date().toISOString();
      localStorage.setItem('lastUserSync', now);
      setLastSync(now);
      
      toast.success('Synchronisation des utilisateurs réussie');
      
      // Appeler le callback de rafraîchissement si fourni
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      toast.error('Erreur lors de la synchronisation des utilisateurs');
    } finally {
      setSyncing(false);
    }
  };

  const getSyncIcon = () => {
    if (loading || syncing) {
      return (
        <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }

    const isSynced = postgresUsers.length === localUsers.length && lastSync;
    
    if (isSynced) {
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }

    return (
      <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    );
  };

  const getSyncStatus = () => {
    if (loading || syncing) {
      return 'Chargement...';
    }

    if (!lastSync) {
      return 'Non synchronisé';
    }

    const isSynced = postgresUsers.length === localUsers.length;
    
    if (isSynced) {
      return 'Synchronisé';
    }

    return 'Désynchronisé';
  };

  const getSyncStatusColor = () => {
    if (loading || syncing) {
      return 'text-blue-600';
    }

    if (!lastSync) {
      return 'text-yellow-600';
    }

    const isSynced = postgresUsers.length === localUsers.length;
    
    if (isSynced) {
      return 'text-green-600';
    }

    return 'text-red-600';
  };

  const formatLastSync = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString('fr-FR');
    } catch {
      return 'Inconnu';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getSyncIcon()}
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Statut de Synchronisation PostgreSQL
            </h3>
            <p className={`text-sm ${getSyncStatusColor()}`}>
              {getSyncStatus()}
            </p>
            {lastSync && (
              <p className="text-xs text-gray-500 mt-1">
                Dernière synchronisation : {formatLastSync(lastSync)}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-900">
              PostgreSQL: {postgresUsers.length} utilisateur(s)
            </p>
            <p className="text-sm text-gray-500">
              Local: {localUsers.length} utilisateur(s)
            </p>
          </div>
          
          <button
            onClick={syncUsers}
            disabled={syncing || loading}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            {syncing ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Synchronisation...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Synchroniser</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Informations détaillées */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Utilisateurs PostgreSQL</h4>
            <div className="space-y-1">
              {postgresUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-gray-700">{user.name}</span>
                  <span className="text-gray-500">({user.role})</span>
                </div>
              ))}
              {postgresUsers.length > 3 && (
                <p className="text-gray-500 text-xs">
                  +{postgresUsers.length - 3} autre(s) utilisateur(s)
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Utilisateurs Locaux</h4>
            <div className="space-y-1">
              {localUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-gray-700">{user.name}</span>
                  <span className="text-gray-500">({user.role})</span>
                </div>
              ))}
              {localUsers.length > 3 && (
                <p className="text-gray-500 text-xs">
                  +{localUsers.length - 3} autre(s) utilisateur(s)
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Statut de Connexion</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">PostgreSQL</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs text-green-600">Connecté</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Synchronisation</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getSyncStatus() === 'Synchronisé' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className={`text-xs ${getSyncStatusColor()}`}>
                    {getSyncStatus()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
