-- Script de configuration PostgreSQL pour CDP Missions
-- À exécuter dans votre client PostgreSQL (psql, pgAdmin, etc.)

-- 1. Créer la base de données (si elle n'existe pas)
-- CREATE DATABASE cdp_missions;

-- 2. Se connecter à la base de données
-- \c cdp_missions;

-- 3. Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    department VARCHAR(255),
    phone VARCHAR(50),
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des missions
CREATE TABLE IF NOT EXISTS missions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type_mission VARCHAR(100),
    organization VARCHAR(255),
    address TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'planifiee',
    motif_controle VARCHAR(100),
    decision_numero VARCHAR(100),
    date_decision TIMESTAMP WITH TIME ZONE,
    team_members TEXT[],
    objectives TEXT[],
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    ignore_auto_status_change BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table des documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table des constats (findings)
CREATE TABLE IF NOT EXISTS findings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50),
    recommendation TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Table des sanctions
CREATE TABLE IF NOT EXISTS sanctions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15,2),
    decision_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Table des remarques
CREATE TABLE IF NOT EXISTS remarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_dates ON missions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_missions_organization ON missions(organization);
CREATE INDEX IF NOT EXISTS idx_documents_mission ON documents(mission_id);
CREATE INDEX IF NOT EXISTS idx_findings_mission ON findings(mission_id);
CREATE INDEX IF NOT EXISTS idx_sanctions_mission ON sanctions(mission_id);
CREATE INDEX IF NOT EXISTS idx_remarks_mission ON remarks(mission_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON findings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sanctions_updated_at BEFORE UPDATE ON sanctions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion de l'utilisateur admin par défaut
INSERT INTO users (email, name, role, department, is_active, password_hash) 
VALUES (
    'abdoulaye.niang@cdp.sn',
    'Abdoulaye Niang',
    'admin',
    'Direction',
    true,
    'UGFzc2Vy' -- 'Passer' encodé en base64
) ON CONFLICT (email) DO NOTHING;

-- Insertion de quelques missions de test
INSERT INTO missions (reference, title, description, type_mission, organization, address, start_date, end_date, status, motif_controle, decision_numero, team_members, objectives) 
VALUES 
(
    'REF-001',
    'Mission de Contrôle Test',
    'Mission de test pour vérifier le fonctionnement de l''application',
    'Contrôle sur place',
    'CDP',
    'Dakar, Sénégal',
    NOW() - INTERVAL '30 days',
    NOW() + INTERVAL '30 days',
    'en_cours',
    'Programme annuel',
    'DEC-2024-001',
    ARRAY['Agent 1', 'Agent 2'],
    ARRAY['Vérifier la conformité', 'Évaluer les risques']
),
(
    'REF-002',
    'Audit Financier',
    'Audit financier des comptes',
    'Contrôle sur pièces',
    'CDP',
    'Thiès, Sénégal',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '37 days',
    'planifiee',
    'Suite a une plainte',
    'DEC-2024-002',
    ARRAY['Expert IT', 'Analyste'],
    ARRAY['Analyser la sécurité', 'Identifier les vulnérabilités']
) ON CONFLICT (reference) DO NOTHING;

-- Vérifier les tables créées
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
