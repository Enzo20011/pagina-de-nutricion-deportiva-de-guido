# Proyecto: Panel de Administración (Admin Dashboard) ⚙️

Este documento registra la evolución, arquitectura y funcionalidades del portal interno de gestión para el Lic. Guido Operuk.

---

## 🏗️ Arquitectura Técnica (Admin)

- **Framework:** Next.js 14 (App Router) en la ruta `app/(admin)`.
- **Estado Global:** `Zustand` (`useConsultaStore`) para persistencia de sesión clínica en el cliente.
- **Sincronización:** `TanStack React Query` para comunicación eficiente con la base de datos.
- **Base de Datos:** MongoDB con esquemas para `Paciente`, `Consulta`, `Dieta` y `Biometria`.

## 🛠️ Módulos de Gestión

1. **Base de Pacientes:** CRUD completo de perfiles, historial y estados.
2. **Panel Clínico (Anamnesis):** Registro de antecedentes, objetivos y cálculos metabólicos (GET/TDEE).
3. **Biometría (Antropometría):** Seguimiento de evolución física con gráficos dinámicos integrados.
4. **Plan Nutricional:** Motor de búsqueda de alimentos híbrido (ARGENFOODS + USDA) y gestión de ingestas diarias.
5. **Exportación:** Generación de reportes PDF unificados de toda la consulta.

## ✅ Avances Destacados
- [x] Investigar infraestructura actual de búsqueda (USDA + Local)
- [x] Crear Guía de Implementación: Motor de Búsqueda Híbrido (ARGENFOODS + USDA)
- [x] Paso 1: Configuración de variables de entorno y API Keys
- [x] Paso 2: Instalación de motor de traducción y optimización de modelos (MongoDB Text Index)
- [x] Paso 3: Volcado de base de datos local (ARGENFOODS) con seed script.
- [x] Paso 4: Implementación de interceptor y traductor USDA en tiempo real.
- [x] Paso 5: Lógica de búsqueda en cascada (Local -> Global) en el Frontend.
- [x] Configuración Final: Activación de Clave Real USDA y verificación de cuota.
- **Motor de Búsqueda Híbrido:**
  - **Backend:** Refactorización de `/api/alimentos` para búsqueda en capas (Local -> USDA).
  - **Traducción:** Integración de librería `translate` con motor Google para consultas bidireccionales ES-EN.
  - **Database:** Esquema `Alimento` oficializado con campos `calorias`, `origen` (Enum) e `idExterno`. Índice de texto activo.
  - **Frontend:** Interfaz `PlanAlimentario.tsx` adaptada para cálculos y visualización bajo el nuevo esquema.

El sistema se encuentra **completamente funcional** y listo para su uso clínico intensivo.
- **Estabilidad:** Verificación completa de todas las rutas administrativas (`/admin/*`).

---
> [!IMPORTANT]
> Este panel es de acceso restringido mediante NextAuth.
> Para la gestión de datos maestros de alimentos nacionales, consultar la [Guía de Inyección ARGENFOODS](file:///c:/Users/enzul/OneDrive/Escritorio/guido/guia_inyeccion_argenfoods.md).
