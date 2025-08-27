import React, { useState, useEffect } from 'react';
import { testConnection, checkDatabaseExists } from '../config/database';
import { PostgresService } from '../services/postgresService';
import { toast } from 'react-hot-toast';

export const PostgresDiagnostic: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<{
    connection: boolean;
    tables: boolean;
    adminUser: boolean;
    loading: boolean;
  }>({
    connection: false,
    tables: false,
    adminUser: false,
    loading: true
  });

  const runDiagnostic = async () => {
    setDiagnosticResults(prev => ({ ...prev, loading: true }));

    try {
      // Test 1: Connexion PostgreSQL
      console.log('🔍 Test 1: Vérification de la connexion PostgreSQL...');
      const connectionOk = await testConnection();
      
      // Test 2: Tables de base de données
      console.log('🔍 Test 2: Vérification des tables...');
      let tablesOk = false;
      if (connectionOk) {
        try {
          const tablesExist = await checkDatabaseExists();
          if (tablesExist) {
            const missions = await PostgresService.getMissions();
            tablesOk = true;
            console.log(`✅ Tables OK - ${missions.length} missions trouvées`);
          } else {
            console.log('❌ Tables non trouvées');
            tablesOk = false;
          }
        } catch (error) {
          console.error('❌ Erreur tables:', error);
          tablesOk = false;
        }
      }

      // Test 3: Utilisateur admin
      console.log('🔍 Test 3: Vérification de l\'utilisateur admin...');
      let adminOk = false;
      if (tablesOk) {
        try {
          const users = await PostgresService.getUsers();
          const adminUser = users.find(u => u.email === 'abdoulaye.niang@cdp.sn' && u.role === 'admin');
          adminOk = !!adminUser;
          console.log(`✅ Admin user: ${adminOk ? 'Trouvé' : 'Non trouvé'}`);
        } catch (error) {
          console.error('❌ Erreur admin user:', error);
          adminOk = false;
        }
      }

      setDiagnosticResults({
        connection: connectionOk,
        tables: tablesOk,
        adminUser: adminOk,
        loading: false
      });

      // Afficher les résultats
      if (connectionOk && tablesOk && adminOk) {
        toast.success('✅ Configuration PostgreSQL complète !');
      } else {
        toast.error('❌ Problèmes détectés dans la configuration PostgreSQL');
      }

    } catch (error) {
      console.error('❌ Erreur lors du diagnostic:', error);
      setDiagnosticResults({
        connection: false,
        tables: false,
        adminUser: false,
        loading: false
      });
      toast.error('❌ Erreur lors du diagnostic PostgreSQL');
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? '✅' : '❌';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'OK' : 'Problème détecté';
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Diagnostic PostgreSQL</h3>
        <button
          onClick={runDiagnostic}
          disabled={diagnosticResults.loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          {diagnosticResults.loading ? 'Diagnostic en cours...' : 'Relancer le diagnostic'}
        </button>
      </div>

      {diagnosticResults.loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Diagnostic en cours...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Test de connexion */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getStatusIcon(diagnosticResults.connection)}</span>
              <div>
                <h4 className="font-medium">Connexion PostgreSQL</h4>
                <p className="text-sm text-gray-600">Vérification de la connexion à la base de données</p>
              </div>
            </div>
            <span className={`font-medium ${getStatusColor(diagnosticResults.connection)}`}>
              {getStatusText(diagnosticResults.connection)}
            </span>
          </div>

          {/* Test des tables */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getStatusIcon(diagnosticResults.tables)}</span>
              <div>
                <h4 className="font-medium">Tables de base de données</h4>
                <p className="text-sm text-gray-600">Vérification de l'existence des tables</p>
              </div>
            </div>
            <span className={`font-medium ${getStatusColor(diagnosticResults.tables)}`}>
              {getStatusText(diagnosticResults.tables)}
            </span>
          </div>

          {/* Test de l'utilisateur admin */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getStatusIcon(diagnosticResults.adminUser)}</span>
              <div>
                <h4 className="font-medium">Utilisateur admin</h4>
                <p className="text-sm text-gray-600">Vérification de l'utilisateur admin par défaut</p>
              </div>
            </div>
            <span className={`font-medium ${getStatusColor(diagnosticResults.adminUser)}`}>
              {getStatusText(diagnosticResults.adminUser)}
            </span>
          </div>

          {/* Résumé */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Résumé</h4>
            <div className="space-y-1 text-sm">
              <p>• Connexion PostgreSQL: {diagnosticResults.connection ? '✅' : '❌'}</p>
              <p>• Tables de base de données: {diagnosticResults.tables ? '✅' : '❌'}</p>
              <p>• Utilisateur admin: {diagnosticResults.adminUser ? '✅' : '❌'}</p>
            </div>
            
            {diagnosticResults.connection && diagnosticResults.tables && diagnosticResults.adminUser ? (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 text-sm">
                  🎉 Configuration PostgreSQL complète ! L'application est prête à utiliser PostgreSQL.
                </p>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Certains problèmes ont été détectés. Consultez le guide de configuration dans SETUP_POSTGRES.md
                </p>
              </div>
            )}
          </div>

          {/* Actions recommandées */}
          {!diagnosticResults.connection && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-900 mb-2">Action recommandée</h4>
              <p className="text-blue-800 text-sm">
                1. Installez PostgreSQL sur votre machine<br/>
                2. Créez une base de données nommée "cdp_missions"<br/>
                3. Exécutez le script SQL dans le fichier postgres-setup.sql<br/>
                4. Vérifiez les variables d'environnement dans le fichier .env
              </p>
            </div>
          )}

          {diagnosticResults.connection && !diagnosticResults.tables && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded">
              <h4 className="font-medium text-orange-900 mb-2">Action recommandée</h4>
              <p className="text-orange-800 text-sm">
                Les tables n'existent pas. Exécutez le script SQL dans le fichier postgres-setup.sql
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
