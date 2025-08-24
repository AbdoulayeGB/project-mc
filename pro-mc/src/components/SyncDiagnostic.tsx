import React, { useState, useEffect } from 'react';
import { SupabaseService } from '../services/supabaseService';

export const SyncDiagnostic: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<{
    envVars: boolean;
    supabaseConnection: boolean;
    tablesExist: boolean;
    adminExists: boolean;
    error?: string;
  }>({
    envVars: false,
    supabaseConnection: false,
    tablesExist: false,
    adminExists: false
  });

  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    const results = {
      envVars: false,
      supabaseConnection: false,
      tablesExist: false,
      adminExists: false,
      error: undefined as string | undefined
    };

    try {
      // 1. Vérifier les variables d'environnement
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      results.envVars = !!(supabaseUrl && supabaseKey && 
        supabaseUrl !== 'https://votre-projet.supabase.co' && 
        supabaseKey !== 'votre-clé-anon-supabase');

      if (!results.envVars) {
        results.error = 'Variables d\'environnement Supabase non configurées';
        setDiagnosticResults(results);
        return;
      }

      // 2. Tester la connexion Supabase
      try {
        const { data, error } = await SupabaseService.supabase.from('users').select('count').limit(1);
        results.supabaseConnection = !error;
        
        if (error) {
          results.error = `Erreur de connexion Supabase: ${error.message}`;
          setDiagnosticResults(results);
          return;
        }
      } catch (error) {
        results.error = `Erreur de connexion: ${error}`;
        setDiagnosticResults(results);
        return;
      }

      // 3. Vérifier que les tables existent
      try {
        const { data: users, error: usersError } = await SupabaseService.supabase.from('users').select('*').limit(1);
        const { data: missions, error: missionsError } = await SupabaseService.supabase.from('missions').select('*').limit(1);
        
        results.tablesExist = !usersError && !missionsError;
        
        if (usersError || missionsError) {
          results.error = `Tables manquantes: ${usersError?.message || missionsError?.message}`;
          setDiagnosticResults(results);
          return;
        }
      } catch (error) {
        results.error = `Erreur lors de la vérification des tables: ${error}`;
        setDiagnosticResults(results);
        return;
      }

      // 4. Vérifier que l'admin existe
      try {
        const { data: admin, error: adminError } = await SupabaseService.supabase
          .from('users')
          .select('*')
          .eq('id', 'admin-1')
          .single();
        
        results.adminExists = !adminError && admin;
        
        if (adminError || !admin) {
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
          <span className="font-medium">Variables d'environnement</span>
          <span className={`font-bold ${getStatusColor(diagnosticResults.envVars)}`}>
            {getStatusIcon(diagnosticResults.envVars)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="font-medium">Connexion Supabase</span>
          <span className={`font-bold ${getStatusColor(diagnosticResults.supabaseConnection)}`}>
            {getStatusIcon(diagnosticResults.supabaseConnection)}
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

      {diagnosticResults.envVars && diagnosticResults.supabaseConnection && 
       diagnosticResults.tablesExist && diagnosticResults.adminExists && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-medium text-green-800 mb-2">✅ Configuration OK</h4>
          <p className="text-green-700 text-sm">
            La synchronisation est correctement configurée. Vos données seront disponibles sur tous les PC.
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-medium mb-2">Variables d'environnement actuelles :</h4>
        <div className="bg-gray-50 p-2 rounded font-mono text-xs">
          <div>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'Non définie'}</div>
          <div>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 
            import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'Non définie'}</div>
        </div>
      </div>
    </div>
  );
};
