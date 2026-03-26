# Proyecto: Plataforma Pública (Public Facing Site) 🌐

Este documento registra la evolución, arquitectura y funcionalidades de la cara pública de la plataforma del Lic. Guido Operuk.

---

## 🏗️ Arquitectura Técnica (Public)

- **Framework:** Next.js 14 (App Router) en la ruta `app/(public)`.
- **Diseño:** Responsive (Mobile-First) con modo oscuro nativo y estética premium.
- **Performance:** Optimización de imágenes, lazy loading y SEO mediante metadatos dinámicos con Open Graph y Twitter Cards.
- **Navegación:** Progress bar global con `next-nprogress-bar` para transiciones fluidas.
- **Pagos:** Flujo de reserva con MercadoPago Checkout Pro integrado.

---

## 🌟 Módulos y Secciones

1. **Home Page (`/`):** Presentación profesional con hero, propuesta de valor y llamadas a la acción (CTA) hacia turnos y servicios.
2. **Servicios (`/servicios`):** Catálogo de nutrición clínica, deportiva y asesoramiento personalizado con componente `ServiciosPageClient` y avales científicos.
3. **Blog Nutricional:** Sistema de artículos y consejos para pacientes y comunidad.
4. **Reserva de Turnos:** Flujo completo con `TurneroInteractivo` — selección de fecha/hora, bloqueo atómico de slots, pago con MercadoPago y confirmación por email.
5. **Página de Éxito (`/success`):** Confirmación visual post-pago con referencia de la reserva.
6. **Legales:** Páginas de Términos y Condiciones y Políticas de Privacidad.

---

## ✅ Avances Completados

### Turnero y Reservas

- [x] **TurneroInteractivo:** Selección de turno con validación en tiempo real de disponibilidad.
- [x] **SlotLock atómico:** Bloqueo temporal de slot durante el proceso de pago para evitar doble reserva.
- [x] **MercadoPago Checkout Pro:** Creación de preferencia de pago y redirección al checkout.
- [x] **Webhook de confirmación:** Endpoint `/api/checkout/callback` que confirma la reserva y crea el evento en Google Calendar al recibir el pago.
- [x] **Página de éxito:** `/success` muestra confirmación con ID de referencia de la reserva.

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

- [x] **Context del Turnero:** `TurneroContext` disponible globalmente en el layout público para coordinar apertura del modal desde cualquier sección.
- [x] **Google Calendar Sync:** Al confirmar el pago, se crea automáticamente un evento en el calendario del profesional con los datos del paciente.

---

> [!NOTE]
> Esta sección se enfoca en la captación y educación del paciente, funcionando como el escaparate principal de la marca profesional.
> El flujo completo es: Landing → Servicios → Turnero → MercadoPago → Confirmación (`/success`).
