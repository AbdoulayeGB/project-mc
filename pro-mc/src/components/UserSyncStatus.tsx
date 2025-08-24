import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { SupabaseService } from '../services/supabaseService';
import { User } from '../types/auth';

interface UserSyncStatusProps {
  onRefresh?: () => void;
}

export const UserSyncStatus: React.FC<UserSyncStatusProps> = ({ onRefresh }) => {
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [supabaseUsers, setSupabaseUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Charger les utilisateurs locaux
      const local = authService.getAllUsers();
      setLocalUsers(local);

      // Charger les utilisateurs Supabase
      try {
        const supabase = await SupabaseService.getUsers();
        setSupabaseUsers(supabase);
        setSyncStatus('✅ Synchronisation réussie');
      } catch (error) {
        console.error('Erreur Supabase:', error);
        setSyncStatus('⚠️ Erreur de connexion Supabase');
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setSyncStatus('❌ Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const syncUsers = async () => {
    setLoading(true);
    try {
      // Forcer la synchronisation
      await authService.syncWithSupabase();
      await loadUsers();
      setSyncStatus('🔄 Synchronisation forcée réussie');
      onRefresh?.();
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      setSyncStatus('❌ Erreur de synchronisation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getSyncIcon = (localUser: User, supabaseUser?: User) => {
    if (!supabaseUser) return '❌';
    if (localUser.email === supabaseUser.email) return '✅';
    return '⚠️';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Statut de Synchronisation des Utilisateurs
        </h3>
        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
          <button
            onClick={syncUsers}
            disabled={loading}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Synchroniser
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Statut: {syncStatus}
        </p>
        <p className="text-sm text-gray-600">
          Utilisateurs locaux: {localUsers.length} | 
          Utilisateurs Supabase: {supabaseUsers.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b text-left">Sync</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Nom</th>
              <th className="px-4 py-2 border-b text-left">Rôle</th>
              <th className="px-4 py-2 border-b text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {localUsers.map((user) => {
              const supabaseUser = supabaseUsers.find(su => su.id === user.id);
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {getSyncIcon(user, supabaseUser)}
                  </td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'supervisor' ? 'bg-orange-100 text-orange-800' :
                      user.role === 'controller' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'viewer' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Légende :</strong></p>
        <p>✅ Utilisateur synchronisé entre local et Supabase</p>
        <p>❌ Utilisateur uniquement en local</p>
        <p>⚠️ Différence entre local et Supabase</p>
      </div>
    </div>
  );
};
