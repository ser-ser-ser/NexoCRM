-- Migration: 012_master_broker_schema
-- Description: Agrega tabla desarrollos y actualiza propiedades para Master Broker

-- 1. Crear tabla desarrollos
create table if not exists public.desarrollos (
  id uuid default gen_random_uuid() primary key,
  creado_en timestamptz default now(),
  nombre text not null,
  tipo text check (tipo in ('industrial', 'residencial', 'mixto')),
  master_plan_url text,
  amenidades jsonb default '[]'::jsonb,
  id_agencia uuid references public.agencias(id) on delete set null
);

-- Habilitar RLS en desarrollos (seguridad por defecto)
alter table public.desarrollos enable row level security;

-- Política de lectura pública (ajustar según necesidad real, por ahora permisivo para lectura)
create policy "Desarrollos son visibles para todos"
  on public.desarrollos for select
  using (true);

-- Política de escritura para usuarios autenticados (ajustar roles después si es necesario)
create policy "Usuarios autenticados pueden crear desarrollos"
  on public.desarrollos for insert
  with check (auth.role() = 'authenticated');

create policy "Usuarios autenticados pueden actualizar sus desarrollos"
  on public.desarrollos for update
  using (auth.role() = 'authenticated');

-- 2. Actualizar tabla propiedades
-- Agregar columna desarrollo_id
alter table public.propiedades 
add column if not exists desarrollo_id uuid references public.desarrollos(id) on delete set null;

-- Crear índice para mejorar performance de joins
create index if not exists idx_propiedades_desarrollo_id on public.propiedades(desarrollo_id);

-- Comentario sobre el JSONB de 'caracteristicas' para Industrial:
-- Se aplicará validación a nivel de aplicación, pero documentamos la estructura esperada:
/*
{
  "tipo_nave": "string",
  "altura_libre": "number",
  "kv_as": "number",
  "ano_construccion": "number",
  "andenes": { "con_rampa": number, "secos": number },
  "piso": { "resistencia_ton_m2": number, "espesor_cm": number },
  "sistema_contra_incendio": "string",
  "espuela_ferrocarril": "boolean",
  "infraestructura": ["agua", "desague", ...],
  "documentacion": "string"
}
*/
