-- Extension UUID si non activée
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des serveurs enregistrés
CREATE TABLE servers (
    guild_id TEXT PRIMARY KEY,                      -- ID du serveur Discord
    voip_number TEXT UNIQUE NOT NULL,               -- Numéro VoIP attribué
    default_channel_id TEXT NOT NULL,               -- Salon vocal à utiliser
    authorized_role_id TEXT NOT NULL,               -- Rôle autorisé à répondre
    custom_name TEXT,                               -- Nom personnalisé du serveur
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enum pour les statuts d’appel
DO $$ BEGIN
    CREATE TYPE call_status AS ENUM ('pending', 'active', 'ended', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table des règles de whitelist
CREATE TABLE whitelist_rules (
    id SERIAL PRIMARY KEY,
    source_guild_id TEXT NOT NULL REFERENCES servers(guild_id) ON DELETE CASCADE,
    target_voip_number TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des règles de blacklist
CREATE TABLE blacklist_rules (
    id SERIAL PRIMARY KEY,
    source_guild_id TEXT NOT NULL REFERENCES servers(guild_id) ON DELETE CASCADE,
    target_voip_number TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des appels actifs
CREATE TABLE active_calls (
    call_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caller_guild_id TEXT NOT NULL REFERENCES servers(guild_id) ON DELETE CASCADE,
    target_guild_id TEXT NOT NULL REFERENCES servers(guild_id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT NOW(),
    status call_status DEFAULT 'pending'
);

-- Table de l’historique des appels
CREATE TABLE call_history (
    id SERIAL PRIMARY KEY,
    caller_guild_id TEXT NOT NULL,
    target_guild_id TEXT NOT NULL,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    status call_status
);

-- Index pour les performances
CREATE INDEX idx_whitelist_source ON whitelist_rules(source_guild_id);
CREATE INDEX idx_blacklist_source ON blacklist_rules(source_guild_id);
CREATE INDEX idx_calls_status ON active_calls(status);
