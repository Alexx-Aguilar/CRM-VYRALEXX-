# VYRALEXX — Creator & Agency Management CRM
> *"Where creators and brands connect."*

**VYRALEXX** es una plataforma SaaS integral, moderna y de alto rendimiento diseñada específicamente para la gestión comercial y operativa de **creadores de contenido, agencias de marketing de influencers y marcas comerciales**.

---

## 💎 Identidad Visual y Diseño (Dark Glassmorphism)

La interfaz de usuario ha sido concebida bajo los más exigentes estándares de diseño de productos SaaS empresariales:
- **Estilo:** Dark Premium con Glassmorphism moderno y paneles translúcidos con `backdrop-filter: blur(16px)`.
- **Paleta de Colores:**
  - Fondo principal: Azul oscuro casi negro (`#080D19`)
  - Superficies y tarjetas: Azul marino profundo translúcido (`#111A2E`)
  - Acentos Neón: Violeta Neón (`#8B5CF6`) y Cian Eléctrico (`#22D3EE`)
  - Acentos complementarios: Azul tecnológico (`#3B82F6`), Esmeralda (`#10B981`) y Carmín (`#EF4444`)
  - Tipografía: Inter & Plus Jakarta Sans moderna.
- **Microinteracciones y Efectos:** Sombras neón difusas, bordes sutiles con iluminación reactiva, transiciones suaves de estado y modales flotantes con desenfoque de fondo.

---

## 🏛️ Arquitectura Full Stack

El sistema está organizado bajo una estructura modular desacoplada, escalable y mantenible:

```
CRM_VYRALEXX/
├── client/                     # Frontend SPA en React + Vite + TypeScript
│   ├── src/
│   │   ├── components/         # Componentes UI reutilizables (Sidebar, Header, Modal, SearchModal, Toast, etc.)
│   │   ├── context/            # Contexto de aplicación (RBAC, notificaciones, toasts, estado global)
│   │   ├── modules/            # Los 16 módulos funcionales completos de VYRALEXX
│   │   ├── services/           # Cliente de API REST (`api.ts`)
│   │   ├── types/              # Definiciones TypeScript de todas las entidades
│   │   ├── App.tsx             # Orquestador del Layout y enrutamiento dinámico
│   │   ├── main.tsx            # Punto de entrada de React
│   │   └── index.css           # Estilos base Tailwind y utilidades Glassmorphism
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts          # Proxy reverso a `/api` para evitar problemas CORS
│
├── server/                     # Backend API REST en Node.js + Express + TypeScript
│   ├── data/                   # Almacenamiento relacional persistente (`vyralexx.db.json`)
│   ├── src/
│   │   ├── db/                 # Motor de base de datos relacional y script de seed realista
│   │   ├── routes/             # Enrutador Express con operaciones CRUD para todos los módulos
│   │   ├── types/              # Tipos compartidos del modelo relacional
│   │   └── index.ts            # Servidor Express, middlewares y gestor de errores
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Scripts raíz para orquestación concurrently
└── README.md
```

### Tecnologías Empleadas:
- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS 3, Lucide React (iconografía moderna), Recharts (gráficos interactivos oscuros).
- **Backend:** Node.js, Express, TypeScript, TSX, CORS, Dotenv.
- **Base de Datos:** Almacenamiento relacional persistente con transacciones atómicas, validación de esquemas y soporte de datos de muestra (`seedData.ts`) con opción de restablecimiento y borrado desde la interfaz.

---

## 🚀 Los 16 Módulos del Sistema

| # | Módulo | Descripción y Capacidades |
|---|---|---|
| **1** | **Dashboard Ejecutivo** | KPIs en tiempo real (Creadores activos, Campañas, Clientes, Facturación), Gráficos interactivos de evolución financiera, cuota de red social, campañas prioritarias con barra de progreso y feed de actividad reciente. |
| **2** | **Gestión de Creadores** | Directorio de talentos con vista en Tarjetas y Tabla, filtros por categoría (Gaming, Moda, Fitness, Belleza, Viajes), país, plataforma y métricas. Perfil detallado con desglose de audiencia (edad, género, países), tarifario (Reels, TikTok, YouTube) y notas internas. |
| **3** | **Gestión de Agencias** | Administración de agencias colaboradoras y matrices, creadores representados, campañas gestionadas, información de directores y sedes. |
| **4** | **Marcas y Clientes** | CRM corporativo para marcas contratantes. Clasificación por estado comercial (*Prospecto, Contactado, Negociación, Cliente activo, Inactivo*), industria, presupuesto anual y líder de cuenta. |
| **5** | **Gestión de Campañas** | Planificación publicitaria, control presupuestario con barras de progreso, vinculación de creadores, checklist de entregables y métricas de impacto (*Impresiones, Alcance, Clicks, Conversiones y ROI*). |
| **6** | **Colaboraciones** | Matriz de conexión Marca ↔ Creador. Flujo de estados con cambio ágil (*Nueva propuesta → En negociación → Aprobada → En producción → Publicada → Completada*). |
| **7** | **Calendario y Planificación** | Vista mensual interactiva de entregas de contenido, fechas de cobro/pago, reuniones comerciales y vencimientos de contratos. Programación y eliminación de eventos. |
| **8** | **Analítica y Reportes** | Métricas consolidadas de alcance, impresiones y tasa de engagement. Gráfico comparativo de redes sociales, ranking de creadores y **exportación a CSV e impresión/PDF**. |
| **9** | **CRM Comercial (Pipeline)** | Tablero Kanban con etapas: *Nuevo prospecto, Primer contacto, Reunión programada, Propuesta enviada, Negociación, Ganado, Perdido*. Cálculo automático de valor total y ponderado. |
| **10**| **Contratos y Documentos** | Gestión de acuerdos legales (*Patrocinio, Representación de talento, NDAs, Servicios de agencia*), control de vigencias y alertas automáticas de vencimiento próximo. |
| **11**| **Presupuestos y Pagos** | Control contable de facturas a marcas (cobros) y pagos a talentos (payouts). Cálculo en vivo de facturación total, pendiente de cobro y margen neto de la agencia. |
| **12**| **Tareas y Proyectos** | Productividad del equipo en formato Lista y Tablero Kanban (*Por hacer, En progreso, En revisión, Completada*), con prioridades, fechas límite y asignados. |
| **13**| **Mensajes y Comunicaciones** | Centro de chat y comunicaciones internas con canales temáticos (*#general-agencia, #campaña-cyberpulse, #nuevos-talentos, #legal-contratos*). |
| **14**| **Archivos y Creativos** | Repositorio organizado de Media Kits, activos de marca (BrandBooks), contratos en PDF, informes y comprobantes de facturación. |
| **15**| **Notificaciones** | Centro de alertas en tiempo real sobre entregables publicados, vencimientos de pago, avances en el pipeline comercial y firmas de contratos. |
| **16**| **Configuración y Datos Demo** | Ajustes de empresa, divisa, zona horaria, monitoreo de APIs sociales (Instagram, TikTok, YouTube) y **controles de datos de demostración** (*Restablecer datos* o *Limpiar base de datos para producción*). |

---

## 🛡️ Control de Acceso Basado en Roles (RBAC)

La plataforma incluye un selector interactivo en la barra superior que permite alternar en tiempo real entre los 5 roles definidos, filtrando dinámicamente la navegación y los permisos:

1. **Superadministrador:** Acceso irrestricto y control total de la plataforma.
2. **Administrador de Agencia:** Gestión de su cartera de talentos, marcas aliadas, campañas y finanzas.
3. **Gestor de Campañas:** Supervisión operativa de entregables, creadores asignados, tareas y calendario.
4. **Creador / Influencer:** Vista de sus campañas vinculadas, acuerdos comerciales, entregables y perfil.
5. **Marca / Cliente:** Consulta de sus campañas contratadas, reportes de impacto y entregables aprobados.

---

## ⚡ Comandos para Ejecutar el Proyecto

### 1. Requisitos Previos
- Node.js versión 18+ (probado exitosamente en Node v24)
- npm versión 9+

### 2. Modo Desarrollo (Servidor + Cliente Simultáneo)
Desde la raíz del proyecto:
```bash
npm run dev
```
- Frontend disponible en: `http://localhost:3000`
- Backend API REST en: `http://localhost:5000`

O puedes iniciarlos de manera independiente:
```bash
# Terminal 1 - Servidor Backend
npm run dev:server

# Terminal 2 - Cliente Frontend
npm run dev:client
```

### 3. Compilación para Producción
Para validar la construcción de ambos entornos:
```bash
npm run build
```

---

## 🎯 Atajos de Teclado
- `Ctrl + K` / `Cmd + K`: Abre la paleta de búsqueda global instantánea para encontrar creadores, campañas o marcas rápidamente.

---

*Desarrollado como un producto SaaS comercial de nivel profesional.*

## Configuración real de MySQL y usuarios

1. En MySQL Workbench crea la base de datos ejecutando `server/sql/schema.sql` o:

```sql
CREATE DATABASE IF NOT EXISTS vyralexx_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copia `server/.env.example` como `server/.env` y completa `DB_USER`, `DB_PASSWORD` y un `JWT_SECRET` largo.

3. Instala las dependencias desde la raíz del proyecto:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

4. Comprueba la conexión y las tablas:

```bash
npm run verify
```

5. Ejecuta la aplicación:

```bash
npm run dev
```

El primer arranque crea la tabla `crm_store`, migra los datos demo iniciales y crea el usuario administrador configurado en `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Cambia esa contraseña después del primer inicio de sesión.

La API requiere autenticación. Los archivos se guardan en `server/uploads/` y se descargan mediante una ruta protegida; no se publican directamente como archivos estáticos.
