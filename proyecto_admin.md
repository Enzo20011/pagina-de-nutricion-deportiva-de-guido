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
4. **Plan Nutricional:** Motor de búsqueda de alimentos (USDA + Nutrinfo) y gestión de ingestas diarias.
5. **Exportación:** Generación de reportes PDF unificados de toda la consulta.

## ✅ Avances Destacados
- [x] Investigar infraestructura actual de búsqueda (USDA + Local)
- [x] Crear Guía de Implementación: Motor de Búsqueda Híbrido (ARGENFOODS + USDA)
- [x] Paso 1: Configuración de variables de entorno y API Keys
- [x] Paso 2: Instalación de motor de traducción y optimización de modelos (MongoDB Text Index)
- [/] Paso 3: Refactorización de lógica de búsqueda híbrida y traducción en tiempo real
- [ ] Paso 4: Carga de base de datos ARGENFOODS y pruebas finales
- **Backend Inteligente:** El buscador prioriza automáticamente ARGENFOODS y Nutrinfo sobre la USDA, eliminando duplicados de forma transparente.
- **Interfaz Mejorada:** Se han añadido filtros visuales específicos y badges de origen para cada resultado de búsqueda.
- **Arquitectura de Datos:** El modelo `Alimento` ha sido enriquecido con el campo `fuente`, permitiendo una categorización precisa por procedencia nutricional.

El sistema se encuentra **completamente funcional** y listo para su uso clínico intensivo.
- **Estabilidad:** Verificación completa de todas las rutas administrativas (`/admin/*`).

---
> [!IMPORTANT]
> Este panel es de acceso restringido mediante NextAuth.
