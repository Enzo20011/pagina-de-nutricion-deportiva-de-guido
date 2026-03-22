# Documentación del Proyecto: Página de Nutrición Deportiva de Guido

Este documento contiene la descripción técnica detallada de la arquitectura, tecnologías y módulos que componen la aplicación web desarrollada para la gestión de nutrición deportiva.

## 1. Stack Tecnológico General
El proyecto está construido sobre el ecosistema de **React** y **Next.js (App Router)**, utilizando un enfoque "Full-Stack" donde tanto el frontend como la API residen en la misma base de código. 

- **Framework**: Next.js 14.1.3 (React 18)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS, Framer Motion (para animaciones)
- **Estado Global**: Zustand y React Query (para fetching y caché de datos)
- **Formularios**: React Hook Form con resolutores de Zod (validación)
- **Autenticación**: NextAuth.js
- **Base de Datos**: MongoDB (usando Mongoose como ORM)
- **Generación de PDFs**: `@react-pdf/renderer` y `html2pdf.js`

---

## 2. Arquitectura de Base de Datos (Mongoose / MongoDB)

El directorio `models/` contiene los esquemas que estructuran la base de datos:

- **Paciente**: Información personal, de contacto y perfil de usuarios/pacientes.
- **Anamnesis**: Historia clínica, antecedentes médicos y de estilo de vida del paciente.
- **Antropometria**: Registro de medidas corporales, pliegues, peso, talla, y evolución física.
- **PlanAlimentario / Dieta**: Asignación de macros, comidas y planificación nutricional.
- **Alimento**: Base de datos de alimentos utilizados para crear los planes.
- **Reserva / SlotLock**: Sistema de turnos, calendario y bloqueo temporal de fechas (turnero).
- **Ingreso**: Gestión financiera, registro de pagos y cobros.

---

## 3. Especificaciones del Backend (API Routes)

El backend está desarrollado utilizando las **API Routes** de Next.js (`app/api/`), exponiendo endpoints RESTful para la comunicación con la base de datos y servicios externos.

### Módulos del Backend:
- `/api/auth`: Integración con NextAuth para el inicio de sesión y protección de rutas.
- `/api/pacientes`: CRUD (Crear, Leer, Actualizar, Borrar) de pacientes.
- `/api/anamnesis & /api/antropometria`: Endpoints para gestionar el historial clínico y evolución física de cada paciente.
- `/api/dieta`: Generación, actualización y consulta de planes alimentarios.
- `/api/appointments & /api/calendar`: Gestión de turnos y sincronización con calendario.
- `/api/checkout & /api/finanzas`: Gestión de pagos, ingresos monetarios y facturación.

---

## 4. Especificaciones del Frontend

La interfaz de usuario está dividida arquitectónicamente gracias al sistema de enrutamiento de Next.js (`app/(admin)` y `app/(public)`) y a una rica librería de componentes modulares ubicados en `components/`.

### Estructura de Rutas (`app/`)
- **`(public)`**: Vistas accesibles para cualquier visitante. Landing page, sección sobre mí, calculadoras de uso libre, y el portal público.
- **`(admin)`**: Panel de control privado (Dashboard) para Guido. Contiene la gestión integral de pacientes, turnos y finanzas.

### Componentes Clave (`components/`)
El frontend está altamente componentizado para maximizar la reutilización de código:

#### A. Landing Page y Portal Público
- `LandingPage.tsx`, `HeroSection.tsx`, `ServiciosSection.tsx`, `SobreMiSection.tsx`: Componentes informativos y estéticos de la presentación principal.
- `PublicPortal.tsx`: Puerta de entrada para clientes.

#### B. Panel de Administración (CRM Clínico)
- `BasePacientes.tsx`, `PanelClinico.tsx`: Tableros de control para la búsqueda y gestión integral de expedientes médicos.
- `PanelAnamnesis.tsx`, `PanelAntropometria.tsx`: Interfaces para la carga de datos de salud y medidas.
- `PlanAlimentario.tsx`, `GeneradorDietaPDF.tsx`: Visualización y exportación de dietas a PDF.
- `DashboardEvolucion.tsx`: Gráficos y seguimiento del progreso del paciente.
- `GestorFinanciero.tsx`: Interfaz para ver ingresos, registrar pagos y balances métricos.

#### C. Herramientas Interactivas
- `CalculadoraMetabolica.tsx`, `EnergyCalculator.tsx`, `CalculadoraClinica.tsx`: Herramientas interactivas para el cálculo de gasto energético y macros.
- `TurneroModerno.tsx`, `TurneroInteractivo.tsx`: Sistema interactivo de agendamiento de citas.

#### D. UI y Utilidades
- `Sidebar.tsx`, `Navbar.tsx`, `AdminNavbar.tsx`: Navegación de la app.
- Formularios Modales: `NuevoPacienteModal.tsx`, `EditarPacienteModal.tsx`, `ModalRegistroPago.tsx`.
- Utilidades Visuales: `Loader.tsx`, `Skeleton.tsx`, `Toast.tsx`, `CommandPalette.tsx`.

---

## 5. Resumen del Flujo de la Aplicación
1. **Público**: Los visitantes exploran la *Landing Page*, utilizan las calculadoras interactivas o agendan un turno a través del turnero. 
2. **Administración**: El nutricionista inicia sesión de manera segura para acceder a un panel donde puede gestionar su calendario, finanzas, y la base de pacientes.
3. **Consulta Médica**: Dentro del perfil del paciente, se completa la *Anamnesis* y la *Antropometría*. Posteriormente, se diseña un *Plan Alimentario* que finalmente puede ser visualizado o exportado en *PDF*.
