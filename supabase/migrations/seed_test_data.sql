-- Semilla de Datos de Prueba (Industrial y Comercial)

-- 1. Insertar Nave Industrial
INSERT INTO propiedades (
  titulo,
  descripcion,
  tipo,
  operacion,
  precio,
  moneda,
  estado,
  ciudad,
  direccion,
  caracteristicas
) VALUES (
  'Nave Industrial Logistics Park',
  'Nave de última milla con acceso controlado y patio de maniobras amplio.',
  'industrial',
  'renta',
  150000,
  'MXN',
  'publicada',
  'Monterrey',
  'Parque Industrial Stiva',
  '{
    "andenes": 4, 
    "kvas": 150, 
    "altura_libre": 12,
    "patio_maniobras": true
  }'::jsonb
);

-- 2. Insertar Local Comercial
INSERT INTO propiedades (
  titulo,
  descripcion,
  tipo,
  operacion,
  precio,
  moneda,
  estado,
  ciudad,
  direccion,
  caracteristicas
) VALUES (
  'Local Comercial Plaza Amberes',
  'Local en planta baja con excelente visibilidad y flujo peatonal.',
  'comercial',
  'renta',
  45000,
  'MXN',
  'publicada',
  'Ciudad de México',
  'Av. Insurgentes Sur 1200',
  '{
    "flujo_peatonal": "alto", 
    "anclas_cercanas": ["Starbucks", "BBVA", "Oxxo"],
    "en_esquina": true
  }'::jsonb
);

-- 3. Insertar Residencia de Lujo (Extra para validar badges)
INSERT INTO propiedades (
  titulo,
  descripcion,
  tipo,
  operacion,
  precio,
  moneda,
  estado,
  ciudad,
  direccion,
  caracteristicas
) VALUES (
  'Residencia en Valle Real',
  'Casa de lujo con acabados premium y alberca privada.',
  'residencial',
  'venta',
  12500000,
  'MXN',
  'publicada',
  'Guadalajara',
  'Paseo de San Arturo 300',
  '{
    "recamaras": 4, 
    "banos": 5.5, 
    "amenidades": ["Alberca", "Gimnasio", "Cine"]
  }'::jsonb
);
