# 📐 NexoCRM UI/UX Blueprint
**Versión:** 1.0 | **Rol:** Product Designer & Frontend Architect
**Objetivo:** Definir la "foto completa" visual y lógica antes de implementar el código complejo.

---

## 🎨 Sistema de Diseño (Base)
*   **Framework**: Next.js 16 + Tailwind CSS.
*   **Component Library**: Shadcn UI (Radix Primitives).
*   **Estilo Visual**: "Profesional Moderno". Bordes sutiles, sombras suaves (Claymorphism ligero), tipografía Inter/Geist.
*   **Paleta Principal**:
    *   `Primary`: Naranja Nexo (`h-12` buttons).
    *   `Industrial`: Azul Pizarra (`bg-slate-100` text-slate-700).
    *   `Comercial`: Púrpura/Indigo (`bg-indigo-50` text-indigo-700).
    *   `Residencial`: Esmeralda/Verde (`bg-emerald-50` text-emerald-700).

---

## A. Vista Principal: 'Command Center' (`/dashboard`)
**Concepto:** Un panel de control ejecutivo. Debe responder "¿Cómo va mi negocio hoy?" en menos de 5 segundos.

### 1. Sección Financiera (Top Row)
*   **Componentes Shadcn**: `Card`, `CardHeader`, `CardTitle`, `CardContent`.
*   **Widgets**:
    *   **💰 Valor Inventario Total**: Sumatoria de precios de propiedades activas.
        *   *Visual*: Número grande, indicador de tendencia (+5% vs mes pasado).
    *   **💵 Comisiones Estimadas**: Calculado al 5% (configurable) del valor de inventario activo.
        *   *Visual*: Color verde/éxito, icono de billete.

### 2. Sección Marketing (Middle Layer)
**Widget: "Tráfico y Leads"**
*   **Objetivo**: Unificar la visión de atracción (Web) y conversión (Leads).
*   **Componentes**: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
*   **Estructura**:
    *   **Tab 1: Google Analytics (Tráfico)**
        *   *Contenido (Placeholder)*: Gráfico de líneas (Recharts) mostrando "Sesiones" vs "Usuarios".
        *   *KPIs*: Tasa de Rebote, Tiempo en Sitio.
    *   **Tab 2: Meta Ads (Leads)**
        *   *Contenido (Placeholder)*: Gráfico de barras mostrando "Leads por Día".
        *   *KPIs*: Costo por Lead (CPL), Gasto Total.
*   **Nota**: Inicialmente se usará `MockData` para validar el layout.

### 3. Gráficos Core (Visualización de Datos)
*   **Widget: Distribución de Inventario**
    *   **Tipo**: Gráfico de Dona (Donut Chart) usando `Recharts`.
    *   **Datos**: Conteo de propiedades por `tipo` (Industrial vs Comercial vs Residencial).
    *   **Leyenda**: Interactiva (click para filtrar).

---

## B. Vista CRM: 'Pipeline Comercial' (`/dashboard/crm`)
**Concepto:** Tablero Kanban para gestión visual de oportunidades. Mover dinero de izquierda a derecha.

### Estructura del Tablero
*   **Librería Sugerida**: `@hello-pangea/dnd` (Drag and Drop accesible).
*   **Columnas (Etapas)**:
    1.  **📥 Nuevo / Prospecto**: Leads entrantes sin contactar.
    2.  **📞 Contactado / Visita**: Ya hubo interacción o cita agendada.
    3.  **🤝 Negociación / Oferta**: Papeles en la mesa.
    4.  **✅ Cierre / Vendido**: Éxito.

### Diseño de la Tarjeta de Oportunidad (Kanban Card)
*   **Header**: Título de la propiedad ("Nave Parque Norte").
*   **Body**:
    *   Cliente: "Grupo Bimbo" (Avatar + Nombre).
    *   Valor: "$15.5M" (Badge verde).
*   **Footer**:
    *   Barra de probabilidad (Progress bar pequeña: 20% -> 50% -> 90%).
    *   Fecha de antigüedad ("Hace 2 días").

---

## C. Vista Inventario: 'Explorador Polimórfico'
**Concepto**: Tabla vitaminada que se adapta al tipo de propiedad sin romper la armonía visual.

### Arquitectura de la Fila (TableRow)
La fila no es estática; cambia sutilmente según el `tipo` de propiedad.

#### 1. Propiedad Industrial 🏭
*   **Icono Principal**: Fábrica (Factory) color Azul.
*   **Datos Clave Vizualizados**:
    *   `Andenes`: Icono de Camión (`Truck`) + Número.
    *   `Altura`: Icono de Flecha (`ArrowUpFromLine`) + Metros.
    *   `Energía`: Icono de Rayo (`Zap`) + KVAs.

#### 2. Propiedad Residencial 🏠
*   **Icono Principal**: Casa (Home) color Esmeralda.
*   **Datos Clave Vizualizados**:
    *   `Recámaras`: Icono de Cama (`BedDouble`).
    *   `Baños`: Icono de Baño (`Bath`).
    *   `Cochera`: Icono de Auto (`Car`).

#### 3. Propiedad Comercial 🏬
*   **Icono Principal**: Tienda (Store) color Índigo.
*   **Datos Clave Vizualizados**:
    *   `Flujo`: Icono de Usuarios (`Users`).
    *   `Anclas`: Badges pequeños con nombres ("Oxxo", "Walmart").

---

## 🧩 Componentes Shadcn UI Requeridos
Para construir esto, necesitaremos instalar/verificar los siguientes componentes:

```bash
npx shadcn@latest add card tabs progress badge avatar separator sheet
```

## 📝 Siguientes Pasos (Implementación)
1.  **Layout**: Maquetar el Grid del Dashboard (CSS Grid es vital aquí).
2.  **Mock Data**: Crear `src/lib/mock-data.ts` para alimentar los gráficos sin backend todavía.
3.  **Componentes**: Crear `DashboardWidgets` y `PipelineKanban`.
