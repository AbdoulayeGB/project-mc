import { supabase } from './config/supabase';

async function testConnection() {
  try {
    console.log('Test de connexion à Supabase...');

    // Test de la table missions
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .limit(1);

    if (missionsError) {
      console.error('Erreur lors de la récupération des missions:', missionsError);
      console.error('Détails de l\'erreur:', {
        message: missionsError.message,
        code: missionsError.code,
        details: missionsError.details,
        hint: missionsError.hint
      });
      return;
    }

    console.log('✅ Connexion à Supabase réussie !');
    console.log('Structure de la base de données:');
    console.log('- Table missions: OK');

    // Test de la table findings
    const { data: findings, error: findingsError } = await supabase
      .from('findings')
      .select('*')
      .limit(1);

    if (findingsError) {
      console.error('Erreur lors de la récupération des constats:', findingsError);
    } else {
      console.log('- Table findings: OK');
    }

    // Test de la table remarks
    const { data: remarks, error: remarksError } = await supabase
      .from('remarks')
      .select('*')
      .limit(1);

    if (remarksError) {
      console.error('Erreur lors de la récupération des remarques:', remarksError);
    } else {
      console.log('- Table remarks: OK');
    }

    // Test de la table sanctions
    const { data: sanctions, error: sanctionsError } = await supabase
      .from('sanctions')
      .select('*')
      .limit(1);

    if (sanctionsError) {
      console.error('Erreur lors de la récupération des sanctions:', sanctionsError);
    } else {
      console.log('- Table sanctions: OK');
    }

    // Test d'insertion d'une mission
    const testMission = {
      reference: 'TEST-' + Date.now(),
      title: 'Mission de test',
      description: 'Description de test',
      type_mission: 'Contrôle sur place',
      organization: 'Organisation de test',
      address: 'Adresse de test',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PLANIFIEE',
      motif_controle: 'Test de connexion',
      team_members: ['Test User'],
      objectives: ['Vérifier la connexion']
    };

    const { data: insertedMission, error: insertError } = await supabase
      .from('missions')
      .insert(testMission)
      .select()
      .single();

    if (insertError) {
      console.error('Erreur lors de l\'insertion de test:', insertError);
    } else {
      console.log('✅ Test d\'insertion réussi !');
      console.log('Mission de test créée:', insertedMission);

      // Nettoyage : suppression de la mission de test
      const { error: deleteError } = await supabase
        .from('missions')
        .delete()
        .eq('id', insertedMission.id);

      if (deleteError) {
        console.error('Erreur lors de la suppression de la mission de test:', deleteError);
      } else {
        console.log('✅ Nettoyage réussi : mission de test supprimée');
      }
    }

  } catch (error) {
    console.error('Erreur lors du test de connexion:', error);
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

testConnection(); 