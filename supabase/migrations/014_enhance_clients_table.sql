-- Enhance clients table with B2B and CRM fields
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS empresa text,
ADD COLUMN IF NOT EXISTS cargo text,
ADD COLUMN IF NOT EXISTS tipo_cliente text, -- 'Inversionista', 'Final', 'Broker'
ADD COLUMN IF NOT EXISTS origen_lead text, -- 'Lona', 'Redes', 'Referido'
ADD COLUMN IF NOT EXISTS presupuesto_min numeric,
ADD COLUMN IF NOT EXISTS presupuesto_max numeric,
ADD COLUMN IF NOT EXISTS notas_perfil text;

-- Add comments for clarity
COMMENT ON COLUMN public.clientes.empresa IS 'Nombre comercial de la empresa o entidad legal';
COMMENT ON COLUMN public.clientes.cargo IS 'Puesto o cargo de la persona de contacto';
COMMENT ON COLUMN public.clientes.tipo_cliente IS 'Categoría: Inversionista, Usuario Final, o Broker';
