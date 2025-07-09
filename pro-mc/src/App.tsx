import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MissionList } from './components/MissionList';
import { MissionForm } from './components/MissionForm';
import { Dashboard } from './components/Dashboard';
import { AdvancedSearch } from './components/AdvancedSearch';
import { useLocalMissions } from './hooks/useLocalMissions';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { db } from './database/localStorageDb';

// Créer une instance de QueryClient en dehors du composant
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Composant principal qui utilise useLocalMissions
function AppContent() {
  const { missions, loading, error, refreshMissions, addMission } = useLocalMissions();

  const handleSubmit = async (data: any) => {
    try {
      await addMission(data);
      toast.success('Mission ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la mission:', error);
      toast.error('Erreur lors de l\'ajout de la mission');
    }
  };

  const handleAddRemark = async (missionId: string, content: string) => {
    try {
      await db.addRemark(missionId, content);
      toast.success('Remarque ajoutée avec succès');
      refreshMissions();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la remarque:', error);
      toast.error('Erreur lors de l\'ajout de la remarque');
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

  const handleAddFinding = async (missionId: string, content: string) => {
    try {
      await db.addFinding(missionId, content);
      toast.success('Constat ajouté avec succès');
      refreshMissions();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du constat:', error);
      toast.error('Erreur lors de l\'ajout du constat');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#fff3e0]">
        <Toaster position="top-right" />
        {/* Barre supérieure */}
        <div className="bg-[#e67e22] text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <a href="mailto:contact@cdp.sn" className="text-sm hover:text-[#f39c12] transition-colors">
                  contact@cdp.sn
                </a>
                <a href="tel:+221338597030" className="text-sm hover:text-[#f39c12] transition-colors">
                +221 33 859 70 30
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl font-bold text-[#e67e22]">
                    CDP Control
                  </span>
                </div>
                <div className="hidden md:ml-12 md:flex md:space-x-8">
                  <Link
                    to="/"
                    className="cdp-nav-link"
                  >
                    Tableau de bord
                  </Link>
                  <Link
                    to="/missions"
                    className="cdp-nav-link"
                  >
                    Liste des missions
                  </Link>
                  <Link
                    to="/nouvelle-mission"
                    className="cdp-nav-link"
                  >
                    Nouvelle mission
                  </Link>
                  <Link
                    to="/recherche"
                    className="cdp-nav-link"
                  >
                    Recherche avancée
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#e67e22]">
                      Tableau de bord
                    </h1>
                    <p className="mt-2 text-[#5d4037]">
                      Vue d'ensemble des missions de contrôle
                    </p>
                  </div>
                  <Dashboard missions={missions} />
                </div>
              }
            />
            <Route
              path="/missions"
              element={
                <div>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#e67e22]">
                      Missions de contrôle
                    </h1>
                    <p className="mt-2 text-[#5d4037]">
                      Gérez et suivez toutes vos missions de contrôle de protection des données
                    </p>
                  </div>
                  <MissionList />
                </div>
              }
            />
            <Route
              path="/nouvelle-mission"
              element={
                <div>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#e67e22]">
                      Nouvelle mission
                    </h1>
                    <p className="mt-2 text-[#5d4037]">
                      Créez une nouvelle mission de contrôle
                    </p>
                  </div>
                  <div className="cdp-card bg-white rounded-lg shadow-md mb-8">
                    <div className="px-6 py-8">
                      <MissionForm onSubmit={handleSubmit} />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/recherche"
              element={
                <div>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#e67e22]">
                      Recherche avancée
                    </h1>
                    <p className="mt-2 text-[#5d4037]">
                      Recherchez des missions selon des critères spécifiques
                    </p>
                  </div>
                  <AdvancedSearch 
                    missions={missions}
                    onSearch={(filters) => console.log('Filtres appliqués:', filters)}
                  />
                </div>
              }
            />
          </Routes>
        </main>

        {/* Pied de page */}
        <footer className="bg-[#e67e22] text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">À propos</h3>
                <p className="text-sm">
                  Plateforme de gestion des missions de contrôle de la Commission de Protection des Données Personnelles
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-sm">Email: contact@cdp.sn</p>
                <p className="text-sm">Tél: +221 33 859 70 30</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-sm hover:text-[#f39c12] transition-colors">Accueil</Link></li>
                  <li><Link to="/missions" className="text-sm hover:text-[#f39c12] transition-colors">Missions</Link></li>
                  <li><Link to="/recherche" className="text-sm hover:text-[#f39c12] transition-colors">Recherche</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} CDP Control. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Composant racine qui fournit le QueryClient
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;