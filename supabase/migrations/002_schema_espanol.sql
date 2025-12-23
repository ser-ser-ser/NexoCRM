-- Migration: 002_schema_espanol.sql

-- 1. Create Types (Spanish)
CREATE TYPE rol_usuario AS ENUM ('admin_agencia', 'agente', 'independiente');
CREATE TYPE tipo_propiedad AS ENUM ('industrial', 'comercial', 'residencial', 'terreno', 'oficina', 'desarrollo');
CREATE TYPE tipo_operacion AS ENUM ('venta', 'renta');

-- 2. Ensure 'perfiles' table exists (if not created via UI)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nombre_completo TEXT,
  email TEXT,
  telefono TEXT,
  avatar_url TEXT,
  rol rol_usuario DEFAULT 'independiente',
  id_agencia UUID, -- FK to be added after agencias check
  especialidad TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Migrate data from 'profiles' to 'perfiles'
INSERT INTO perfiles (id, nombre_completo, email, telefono, avatar_url, creado_en)
SELECT id, full_name, email, phone, avatar_url, created_at
FROM profiles
ON CONFLICT (id) DO NOTHING;

-- 4. Ensure 'propiedades' table exists
CREATE TABLE IF NOT EXISTS propiedades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT,
  descripcion TEXT,
  precio NUMERIC,
  moneda TEXT DEFAULT 'MXN',
  tipo tipo_propiedad,
  operacion tipo_operacion,
  estado TEXT DEFAULT 'borrador', -- publicada, borrador, archivada
  ubicacion POINT, -- Casting later if needed or just use text/json
  direccion TEXT,
  ciudad TEXT,
  imagen_principal TEXT,
  propietario_id UUID REFERENCES perfiles(id),
  caracteristicas JSONB DEFAULT '{}'::jsonb, -- POLYMORPHIC COLUMN
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Migrate data from 'properties' to 'propiedades'
-- Mapping columns best effort. 'property_type' needs casting.
INSERT INTO propiedades (id, titulo, descripcion, precio, moneda, direccion, propietario_id, creado_en)
SELECT 
  id, 
  title, 
  description, 
  price, 
  currency, 
  -- address field might vary, assuming 'location' or similar if distinct column exists, otherwise NULL
  NULL, 
  owner_id, 
  created_at
FROM properties
ON CONFLICT (id) DO NOTHING;

-- 6. Cleanup (Legacy English Tables)
-- WARNING: Only dropping after successful migration. 
-- Commented out for safety in this run, usually we drop.
-- DROP TABLE properties;
-- DROP TABLE profiles;

-- 7. Sync Foreign Keys
ALTER TABLE propiedades 
ADD CONSTRAINT fk_propiedad_propietario 
FOREIGN KEY (propietario_id) REFERENCES perfiles(id);

-- 8. Enable RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

-- Policy: Public read for properties
CREATE POLICY "Propiedades visibles para todos" ON propiedades
FOR SELECT USING (true);

-- Policy: Agents edit their own
CREATE POLICY "Agentes editan sus propiedades" ON propiedades
FOR ALL USING (auth.uid() = propietario_id);
