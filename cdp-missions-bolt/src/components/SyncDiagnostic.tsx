import React, { useState, useEffect } from 'react';
import { PostgresService } from '../services/postgresService';

export const SyncDiagnostic: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<{
    postgresConnection: boolean;
    tablesExist: boolean;
    adminExists: boolean;
    error?: string;
  }>({
    postgresConnection: false,
    tablesExist: false,
    adminExists: false
  });

  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    const results = {
      postgresConnection: false,
      tablesExist: false,
      adminExists: false,
      error: undefined as string | undefined
    };

    try {
      // 1. Tester la connexion PostgreSQL
      try {
        const users = await PostgresService.getUsers();
        results.postgresConnection = true;
      } catch (error) {
        results.error = `Erreur de connexion PostgreSQL: ${error}`;
        setDiagnosticResults(results);
        return;
      }

      // 2. Vérifier que les tables existent
      try {
        const users = await PostgresService.getUsers();
        const missions = await PostgresService.getMissions();
        
        results.tablesExist = true;
      } catch (error) {
        results.error = `Tables manquantes: ${error}`;
        setDiagnosticResults(results);
        return;
      }

      // 3. Vérifier que l'admin existe
      try {
        const admin = await PostgresService.getUserByEmail('abdoulaye.niang@cdp.sn');
        
        results.adminExists = !!admin;
        
        if (!admin) {
          results.error = 'Utilisateur admin par défaut manquant';
          setDiagnosticResults(results);
          return;
        }
      } catch (error) {
        results.error = `Erreur lors de la vérification de l'admin: ${error}`;
        setDiagnosticResults(results);
        return;
      }

      setDiagnosticResults(results);
    } catch (error) {
      results.error = `Erreur générale: ${error}`;
      setDiagnosticResults(results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const getStatusIcon = (status: boolean) => status ? '✅' : '❌';
  const getStatusColor = (status: boolean) => status ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Diagnostic de Synchronisation
        </h3>
        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Diagnostic...' : 'Relancer'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded">
          <span className="font-medium">Connexion PostgreSQL</span>
          <span className={`font-bold ${getStatusColor(diagnosticResults.postgresConnection)}`}>
            {getStatusIcon(diagnosticResults.postgresConnection)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="font-medium">Tables de base de données</span>
          <span className={`font-bold ${getStatusColor(diagnosticResults.tablesExist)}`}>
            {getStatusIcon(diagnosticResults.tablesExist)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="font-medium">Utilisateur admin</span>
          <span className={`font-bold ${getStatusColor(diagnosticResults.adminExists)}`}>
            {getStatusIcon(diagnosticResults.adminExists)}
          </span>
        </div>
      </div>

      {diagnosticResults.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-medium text-red-800 mb-2">Erreur détectée :</h4>
          <p className="text-red-700 text-sm">{diagnosticResults.error}</p>
        </div>
      )}

      {diagnosticResults.postgresConnection && 
       diagnosticResults.tablesExist && diagnosticResults.adminExists && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-medium text-green-800 mb-2">✅ Configuration OK</h4>
          <p className="text-green-700 text-sm">
            La synchronisation est correctement configurée. Vos données seront disponibles sur tous les PC.
          </p>
        </div>
      )}


    </div>
  );
};
