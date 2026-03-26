import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const auth = new google.auth.JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY,
  scopes: SCOPES,
});

const calendarClient = google.calendar({ version: 'v3', auth });

/**
 * Sincroniza una reserva con Google Calendar.
 * Si las credenciales no están configuradas, lo registra en consola (Modo Dev).
 */
export async function syncAppointmentToCalendar(reserva: {
  nombre: string;
  email: string;
  telefono: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  duracion?: number; // minutos
}) {
  if (!CLIENT_EMAIL || !PRIVATE_KEY || !CALENDAR_ID) {
    console.warn('⚠️ Google Calendar no configurado. Omite sincronización real.');
    return { mock: true, success: true };
  }

  try {
    const startTime = new Date(`${reserva.fecha}T${reserva.hora}:00`);
    const endTime = new Date(startTime.getTime() + (reserva.duracion || 60) * 60000);

    const event = {
      summary: `Nutrición: ${reserva.nombre}`,
      description: `Paciente: ${reserva.nombre}\nEmail: ${reserva.email}\nTel: ${reserva.telefono}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      status: 'confirmed',
    };

    const response = await calendarClient.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    console.log(`✅ Evento creado en Calendar: ${response.data.id}`);
    return { success: true, googleEventId: response.data.id };
  } catch (error: any) {
    console.error('❌ Error sincronizando con Google Calendar:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene los eventos del día para verificar disponibilidad real.
 */
export async function getCalendarEventsForDay(dateStr: string) {
  if (!CLIENT_EMAIL || !PRIVATE_KEY || !CALENDAR_ID) {
    return [];
  }

  try {
    const timeMin = new Date(`${dateStr}T00:00:00Z`).toISOString();
    const timeMax = new Date(`${dateStr}T23:59:59Z`).toISOString();

    const response = await calendarClient.events.list({
      calendarId: CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return [];
  }
}
