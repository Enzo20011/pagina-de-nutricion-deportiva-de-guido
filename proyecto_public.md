# Proyecto: Plataforma Pública (Public Facing Site) 🌐

Este documento registra la evolución, arquitectura y funcionalidades de la cara pública de la plataforma del Lic. Guido Operuk.

---

## 🏗️ Arquitectura Técnica (Public)

- **Framework:** Next.js 14 (App Router) en la ruta `app/(public)`.
- **Diseño:** Responsive (Mobile-First) con modo oscuro nativo y estética premium.
- **Performance:** Optimización de imágenes, lazy loading y SEO mediante metadatos dinámicos con Open Graph y Twitter Cards.
- **Navegación:** Progress bar global con `next-nprogress-bar`.
- **Pagos:** Sistema de reserva directa (Pasarela de pagos deshabilitada por solicitud del cliente). El cobro se gestiona manualmente.

---

## 🌟 Módulos y Secciones

1. **Home Page (`/`):** Presentación profesional con hero, propuesta de valor y llamadas a la acción (CTA) hacia turnos y servicios.
2. **Servicios (`/servicios`):** Catálogo de nutrición clínica, deportiva y asesoramiento personalizado con componente `ServiciosPageClient` y avales científicos.
3. **Blog Nutricional:** Sistema de artículos y consejos para pacientes y comunidad.
4. **Reserva de Turnos:** Flujo completo con `TurneroInteractivo` — selección de fecha/hora, bloqueo atómico de slots, reserva directa y confirmación automática.
5. **Página de Éxito (`/success`):** Confirmación visual inmediata post-reserva, sin distracciones de pago.
6. **Legales:** Páginas de Términos y Condiciones y Políticas de Privacidad.

---

## ✅ Avances Completados

### Turnero y Reservas

- [x] **TurneroInteractivo:** Selección de turno con validación en tiempo real de disponibilidad.
- [x] **SlotLock atómico:** Bloqueo temporal de slot durante el proceso para evitar doble reserva.
- [x] **Reserva Directa:** Eliminada la pasarela de Mercado Pago. Las reservas pasan a estado `confirmada` al instante.
- [x] **Página de éxito:** `/success` simplificada, eliminando referencias de ID y mensajes de pago.

### SEO y Metadata

- [x] **Open Graph y Twitter Cards:** Imágenes y descripciones optimizadas para redes sociales.
- [x] **Metadatos dinámicos:** Título, descripción y keywords configurados por página.
- [x] **Canonical URL:** Configurado `metadataBase` apuntando a `guidooperuk.com`.
- [x] **Robots:** Indexación habilitada con directivas para Googlebot.

### UX / UI

- [x] **Progress Bar Global:** `ProgressBarProvider` activo en toda la app para navegaciones fluidas.
- [x] **ServiciosPageClient:** Componente cliente que conecta la página de servicios con el contexto del turnero (`useTurnero`) para abrir el sistema de reservas directamente.
- [x] **ScientificAvales:** Sección de respaldo científico en la página de servicios.
- [x] **Modo oscuro nativo:** Paleta `#070C14` / `#0a0f14` con acentos en `#3b82f6`.
- [x] **Animaciones:** Transiciones con `Framer Motion` en hero, secciones y componentes interactivos.

### Infraestructura

- [x] **Turnero Context:** `TurneroContext` disponible globalmente en el layout público para coordinar apertura del modal desde cualquier sección.
- [x] **Google Calendar Sync:** Al confirmar la reserva directa, se crea automáticamente un evento en el calendario del profesional con los datos del paciente.

---

## 🚀 Avances recientes no documentados

- **Centralización de datos de contacto:**
	El número de WhatsApp y teléfono se centralizó en constantes reutilizables, facilitando cambios futuros y evitando inconsistencias.

- **Mejoras de accesibilidad y responsividad en la UI:**
	Ajustes en botones, menús móviles, y componentes visuales para una experiencia más fluida y accesible en todos los dispositivos.

- **Carga dinámica de secciones pesadas en landing:**
	Se implementó carga dinámica para Calculadora Metabólica, Testimonios y Avales Científicos, optimizando el tiempo de carga inicial.

- **Pantallas de loading personalizadas:**
	Se agregaron pantallas de carga animadas para las páginas de Servicios y Sobre Mí, mejorando la percepción de velocidad y profesionalismo.

- **Página de Sobre Mí como componente cliente:**
   Ahora la página "Sobre Mí" utiliza un componente cliente que integra la sección de avales científicos y permite interacción directa con el sistema de turnos.

---

## 🛠️ Turnero Inteligente (v7)

### Validación Cronológica
- **Filtrado de Horarios Pasados:** El `TurneroInteractivo` ahora valida la hora actual del servidor/cliente. Si la fecha seleccionada es "Hoy", el sistema oculta o deshabilita automáticamente los turnos que ya han pasado (ej: si son las 14:00, no muestra el turno de las 09:00).
- **Consistencia de Disponibilidad:** Se mejoró la comunicación con el endpoint de disponibilidad para asegurar que los slots ocupados coincidan exactamente con la visualización del calendario.
- **UX de Reserva:** Se añadieron estados visuales claros (tachado y opacidad reducida) para turnos no disponibles, mejorando la intuitividad del proceso de reserva.

---

- **Integración de Email Profesional:**
    Se añadió el correo `lic.guidooperuk@gmail.com` tanto en la sección de contacto principal como en el Footer, mejorando las vías de comunicación directa.

---

> [!NOTE]
> Esta sección se enfoca en la captación y educación del paciente, funcionando como el escaparate principal de la marca profesional.
> El flujo completo es: Landing → Servicios → Turnero → Reserva Directa → Confirmación (`/success`).

