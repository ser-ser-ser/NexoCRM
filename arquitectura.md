NexoCRM: La Biblia del Proyecto & Lógica de Negocio
1. Filosofía Central: Especialización vs. Generalización
NexoCRM nace para resolver el problema de los CRMs generalistas (como Odoo o Salesforce) que son demasiado complejos y genéricos para el Real Estate profesional.

El Problema: Un CRM normal trata igual a una casa que a una nave industrial.

Nuestra Solución: Un ERP Polimórfico que entiende la naturaleza de cada activo. No vendemos "propiedades", gestionamos activos de inversión.

Experiencia de Usuario (UX): Debe ser una herramienta que el broker quiera usar, no que tenga que usar. Simple, visual y potente.

2. El Corazón del Negocio: Inventario Polimórfico
El sistema no puede ser plano. La ficha de propiedad debe mutar según su categoría:

A. Industrial (Logística y Manufactura)
Enfoque: Especificaciones técnicas críticas para empresas.

Datos Clave: Altura libre (m), Resistencia del piso (Ton/m²), Andenes de carga (Cross-dock), Capacidad eléctrica (KVAs), Seguridad del parque, Acceso para tráilers.

Cliente Tipo: Directores de operaciones, Logística.

B. Comercial & Retail (Site Selection / Tenant Rep)
Enfoque: Análisis de mercado y ubicación estratégica para franquicias.

Datos Clave: Flujo peatonal/vehicular, Frente de aparador (metros), Marcas ancla cercanas (ej. "Al lado de Walmart"), Uso de suelo comercial, Nivel socioeconómico de la zona.

Concepto "Tenant Rep": El sistema ayuda a representar al inquilino buscando la ubicación ideal para su negocio.

C. Residencial (Venta y Renta Tradicional)
Enfoque: Estilo de vida y comodidades.

Datos Clave: Recámaras, Baños, Amenidades, Jardín, Pet-friendly.

3. Estructura de Usuarios y Jerarquía (Tenancy)
El sistema soporta diferentes modelos de negocio inmobiliario simultáneamente:

La Agencia (ej. "Brokermex"):

Admin de Agencia: Ve todo el inventario y rendimiento de sus agentes. Configura comisiones y metas.

Agente (Staff): Usuario subordinado. Solo puede editar sus propiedades y leads, pero puede ver (lectura) el inventario global de la agencia para hacer cruces.

El Broker Independiente:

Es su propio Admin. Tiene acceso total a sus datos pero no gestiona equipo.

Avatar: Identidad digital del usuario para personalizar la experiencia.

4. Ecosistema de Captación (El "Hub" Central)
NexoCRM centraliza el caos de la prospección inmobiliaria en México:

Origen Digital (Online): Leads que llegan via API desde Portales (Inmuebles24), Redes Sociales (Facebook/Instagram Ads) o el sitio web propio.

Origen Offline (Tradicional): El mercado real sigue en la calle. El sistema debe permitir registrar leads captados por:

"Lonas" y carteles en la propiedad.

Recorridos de zona (Farming).

Referidos y Networking.

Guardias de seguridad en parques industriales.

5. Gestión de Comisiones y Red de Brokers
El dinero es lo que mueve al broker. El sistema debe dar claridad financiera:

Split Interno: Reglas automáticas entre Agencia/Agente (ej. 50/50, 70/30).

Partners Externos: Capacidad de registrar propiedades compartidas con brokers externos que no usan el sistema. El ERP debe saber que, aunque la venta fue de 1 millón, el ingreso real es solo el 50% porque se compartió comisión.

6. Visión Técnica: El Monolito Modular
Arquitectura: Next.js 16 (App Router) sobre Supabase.

Estrategia de Datos: Uso de JSONB en PostgreSQL para manejar la flexibilidad de los campos industriales/comerciales sin crear cientos de columnas vacías.

Infraestructura: Despliegue en Vercel, pensando en escalabilidad pero iniciando con simplicidad.