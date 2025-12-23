-- Migration: 002_schema_espanol_v3.sql

-- 1. Create Types (Spanish)
DO $$ BEGIN
    CREATE TYPE rol_usuario AS ENUM ('admin_agencia', 'agente', 'independiente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_propiedad AS ENUM ('industrial', 'comercial', 'residencial', 'terreno', 'oficina', 'desarrollo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_operacion AS ENUM ('venta', 'renta');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Ensure 'perfiles' table exists
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nombre_completo TEXT,
  email TEXT,
  telefono TEXT,
  avatar_url TEXT,
  rol rol_usuario DEFAULT 'independiente',
  id_agencia UUID,
  especialidad TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Migrate data from 'profiles' to 'perfiles'
INSERT INTO perfiles (id, nombre_completo, email, telefono, avatar_url, creado_en)
SELECT id, full_name, email, phone, avatar_url, created_at
FROM profiles
ON CONFLICT (id) DO NOTHING;

-- 4. Ensure 'propiedades' table exists and has columns
CREATE TABLE IF NOT EXISTS propiedades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- DROP Incorrect Old FK if exists (pointing to clientes)
ALTER TABLE propiedades DROP CONSTRAINT IF EXISTS propiedades_propietario_id_fkey;

-- Add columns if they don't exist
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS precio NUMERIC;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS moneda TEXT DEFAULT 'MXN';
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS tipo tipo_propiedad;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS operacion tipo_operacion;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'borrador';
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS ubicacion POINT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS imagen_principal TEXT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS direccion TEXT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS ciudad TEXT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS propietario_id UUID;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS caracteristicas JSONB DEFAULT '{}'::jsonb;

-- 5. Migrate data from 'properties' to 'propiedades'
INSERT INTO propiedades (id, titulo, descripcion, precio, moneda, direccion, propietario_id, creado_en)
SELECT 
  id, 
  title, 
  description, 
  price, 
  currency, 
  NULL, 
  owner_id, 
  created_at
FROM properties
ON CONFLICT (id) DO NOTHING;

-- 7. Sync Foreign Keys (Correctly pointing to perfiles)
DO $$ BEGIN
  ALTER TABLE propiedades 
  ADD CONSTRAINT fk_propiedad_propietario 
  FOREIGN KEY (propietario_id) REFERENCES perfiles(id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 8. Enable RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

-- Policy: Public read
DROP POLICY IF EXISTS "Propiedades visibles para todos" ON propiedades;
CREATE POLICY "Propiedades visibles para todos" ON propiedades
FOR SELECT USING (true);

-- Policy: Agents edit their own
DROP POLICY IF EXISTS "Agentes editan sus propiedades" ON propiedades;
CREATE POLICY "Agentes editan sus propiedades" ON propiedades
FOR ALL USING (auth.uid() = propietario_id);
