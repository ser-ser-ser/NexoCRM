-- Add branding columns to perfiles table
-- This allows storing a specific photo and agency logo URL for PDF generation
-- independent of the potentially standard avatar_url.

ALTER TABLE public.perfiles
ADD COLUMN IF NOT EXISTS foto_url text,
ADD COLUMN IF NOT EXISTS logo_agencia_url text;

-- Add comment for clarity
COMMENT ON COLUMN public.perfiles.foto_url IS 'URL de la foto profesional del agente para fichas técnicas';
COMMENT ON COLUMN public.perfiles.logo_agencia_url IS 'URL del logo de la agencia o personal para branding en documentos';
