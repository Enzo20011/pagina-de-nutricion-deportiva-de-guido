# Proyecto: Panel de Administración (Admin Dashboard) ⚙️

Este documento registra la evolución, arquitectura y funcionalidades del portal interno de gestión para el Lic. Guido Operuk.

---

## 🏗️ Arquitectura Técnica (Admin)

- **Framework:** Next.js 14 (App Router) en la ruta `app/(admin)`.
- **Base de Datos:** PostgreSQL serverless en **Neon** via **Prisma ORM** (migrado desde MongoDB).
- **Estado Global:** `Zustand` (`useConsultaStore`) para persistencia de sesión clínica en el cliente.
- **Sincronización:** `TanStack React Query` para comunicación eficiente con la base de datos.
- **Autenticación:** `NextAuth.js` con lista blanca restrictiva (Enzo/Guido) y contraseñas individuales en `.env`.
- **Pagos:** Registro manual por el administrador (Pasarela de pagos deshabilitada para reservas directas).
- **Calendario:** Google Calendar API con sincronización automática de reservas confirmadas.

---

## 🛠️ Módulos de Gestión

1. **Dashboard Principal (`/admin`):** Estadísticas en tiempo real — total de pacientes, agenda del día, ingresos del mes y próximas sesiones. Búsqueda predictiva de pacientes desde el header.
2. **Base de Pacientes (`/admin/pacientes`):** CRUD completo de perfiles, historial clínico, búsqueda por nombre/DNI/email y soft-delete.
3. **Consulta Clínica (`/admin/consulta/[id]`):** Flujo completo de sesión por paciente con 4 paneles:
   - **Anamnesis (PanelClinico):** Antecedentes, objetivos, cálculos metabólicos (GET/TDEE/IMC).
   - **Antropometría (PanelAntropometria):** Seguimiento de evolución física con gráficos `Recharts`.
   - **Plan Alimentario (PlanAlimentario):** Motor de búsqueda híbrido ARGENFOODS + USDA, gestión de ingestas y macros.
   - **Evolución (DashboardEvolucion):** Visualización histórica de métricas clínicas.
4. **Agenda (`/admin/agenda`):** Vista de calendario con `AgendaViewer`, integrado con reservas y Google Calendar.
5. **Exportación PDF:** Generación de reportes clínicos completos con `@react-pdf/renderer`.

---

## ✅ Avances Completados

### Infraestructura

- [x] **Migración MongoDB → PostgreSQL/Prisma (Neon):** Toda la app migrada. Modelos: `Paciente`, `Reserva`, `SlotLock`, `Consulta`, `Biometria`, `Ingreso`, `Alimento`, `Post`.
- [x] **Edge Middleware:** Protección de rutas `/admin/*` con `NextAuth` sin flickering de UI.
- [x] **API Response Helpers:** Utilidades `apiSuccess` / `apiError` para respuestas consistentes.
- [x] **Validación Centralizada:** Schemas `Zod` en `lib/validations` aplicados en todas las rutas de mutación.

### Dashboard

- [x] **Stats en tiempo real:** Endpoint `/api/admin/dashboard/stats` — pacientes totales, agenda de hoy, sesiones próximas, ingresos del mes.
- [x] **Búsqueda de pacientes:** Endpoint `/api/admin/pacientes/search?q=` con búsqueda insensible a mayúsculas por nombre, apellido y DNI.
- [x] **Bug fix — IDs cruzados:** Las tarjetas de "Próximas Sesiones" resuelven el `pacienteId` desde el email de la reserva. Si el paciente no tiene ficha, aparece "Crear Ficha" pre-relleno.
- [x] **Sparklines:** Componente `Sparkline.tsx` con SVG para visualización de tendencias en tarjetas de stats.

### Motor de Alimentos

- [x] **Inyección ARGENFOODS:** 417 alimentos nacionales cargados en PostgreSQL desde dataset ARGENFOODS.
- [x] **Motor Híbrido (Local → USDA):** Búsqueda en cascada: primero local (ARGENFOODS), luego API USDA con traducción automática ES→EN.
- [x] **Traductor integrado:** Librería `translate` con motor Google para queries bidireccionales.

### Turnos y Pagos

- [x] **Reserva atómica:** `SlotLock` con TTL para evitar race conditions en reservas simultáneas.
- [x] **MercadoPago Checkout Pro:** Flujo completo — creación de preferencia, webhook de confirmación y página de éxito (`/success`).
- [x] **Google Calendar Sync:** Creación automática de eventos en el calendario del profesional al confirmar un turno.

### UX / UI

- [x] **Progress Bar:** `ProgressBarProvider` con `next-nprogress-bar` en todas las navegaciones.
- [x] **Skeleton Loaders:** `DashboardSkeleton` y `Loader` para estados de carga.
- [x] **Responsive Dual-View:** Layout inteligente para el Plan Alimentario. En Desktop las tablas son fijas y apiladas; en Móvil se usan modales a pantalla completa.
- [x] **Cleanup:** Eliminados componentes legacy y la integración de Mercado Pago en el flujo administrativo.

---

## 📁 Estructura de Rutas API (Admin)

| Ruta | Método | Descripción |
| --- | --- | --- |
| `/api/admin/dashboard/stats` | GET | Stats en tiempo real del dashboard |
| `/api/admin/pacientes/search` | GET | Búsqueda predictiva de pacientes |
| `/api/pacientes` | GET/POST | Listado y creación de pacientes |
| `/api/pacientes/[id]` | GET/PUT/DELETE | CRUD individual de paciente |
| `/api/pacientes/[id]/historial` | GET | Historial clínico del paciente |
| `/api/anamnesis` | GET/POST | Datos de anamnesis clínica |
| `/api/biometria` | GET/POST | Medidas antropométricas |
| `/api/alimentos` | GET | Búsqueda híbrida de alimentos |
| `/api/appointments/lock` | POST | Bloqueo temporal de slot |
| `/api/appointments/reserve` | POST | Confirmación de reserva directa (Status: confirmada) |
| `/api/appointments/cleanup` | GET | Limpieza automática de turnos pasados |

---


---

## 🚀 Avances recientes no documentados

- **Persistencia avanzada de macros y calorías en anamnesis:**
   Ahora se guardan y restauran automáticamente los valores de offset calórico y porcentajes de macros (carbohidratos, proteínas, grasas) en la ficha clínica de cada paciente. Esto permite que los cálculos y ajustes personalizados se mantengan entre sesiones y recargas.

- **Mejoras de responsividad y accesibilidad:**
   Se ajustaron paddings, tamaños de fuente y disposición de grids en los paneles clínicos y antropométricos para una mejor experiencia en dispositivos móviles y pantallas pequeñas.

- **Carga dinámica de componentes pesados:**
   Componentes como modales y papelera de pacientes ahora se cargan dinámicamente para mejorar el rendimiento inicial del dashboard.

- **Transiciones animadas entre páginas del admin:**
   Se agregó un componente de transición animada para mejorar la experiencia visual al navegar entre secciones internas del panel.

- **Notas clínicas en PDF de consulta:**
   Las notas clínicas ahora se incluyen en la exportación PDF de la consulta, mostrando título, fecha y contenido de cada nota registrada.

---

## 🛠️ Estabilización y Automatización (v7)

### Gestión de Datos Biométricos
- **Ownership Protocol (v4):** Implementación de la propiedad `isActive` en paneles para prevenir bucles infinitos de actualización cruzada entre Anamnesis y Antropometría.
- **Sincronización Silenciosa (v5):** Hidratación interna de formularios en segundo plano para evitar que datos viejos sobrescriban cambios recientes al cambiar de pestaña.
- **Aislamiento de Pacientes (v6):** Protocolo de limpieza forzada (`reset`) al cambiar de ID de paciente en el dashboard, eliminando cualquier rastro de datos de la sesión anterior.
- **Persistencia Robusta (v7):** Prioridad de carga desde la sesión local de `Zustand` sobre la base de datos para evitar pérdida de información (específicamente en perímetros y pliegues) durante recargas de página.

### Agenda y Turnos
- **Automatización de Limpieza:** Nuevo endpoint `/api/appointments/cleanup` que se dispara al entrar a la agenda.
- **Regla de 2 Horas:** Los turnos se procesan automáticamente 2 horas después de su inicio.
- **Archivado Histórico:** Los turnos pasados no se borran de la base de datos; cambian su estado a `completada` para mantener el historial clínico.
- **Limpieza de Google Calendar:** Los eventos pasados se eliminan automáticamente de la cuenta de Google del profesional para mantener el calendario externo despejado.

### UX y Seguridad (v8)
- **Seguridad Restringida:** Implementación de lista blanca en `lib/auth.ts`. Solo Enzo y Guido pueden entrar con sus respectivas credenciales.
- **Responsive Dual (Plan Alimentario):**
    - **Desktop**: Tablas y Recomendaciones visibles 24/7 de forma apilada.
    - **Móvil**: Botones táctiles que abren un entorno de edición a pantalla completa.
- **Textareas Inteligentes:** Mejorados los inputs de nutrición para soportar textos largos con scroll y auto-ajuste, evitando colisiones con el botón de eliminar.
- **Búsqueda Optimizada:** Implementación de *debouncing* en el filtrado de pacientes para mejorar el rendimiento.
- **Maquetación fija:** El panel de contacto en la base de pacientes ahora tiene scroll interno, evitando que se desplace verticalmente con historiales largos.

---

> [!IMPORTANT]
> Este panel es de acceso restringido mediante NextAuth.
> Para la gestión de datos maestros de alimentos nacionales, consultar la [Guía de Inyección ARGENFOODS](./guia_inyeccion_argenfoods.md).
