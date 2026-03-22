import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const auth = new google.auth.JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

export async function GET() {
  try {
    // Check for required env vars
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
      return NextResponse.json({ 
        message: 'Google Calendar integration not configured',
        mock: true,
        availableSlots: ['09:00', '10:00', '11:00', '15:00', '16:00']
      }, { status: 200 }); // Return mock for now if not configured
    }

    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json(response.data.items);
  } catch (error: any) {
    console.error('Calendar Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { summary, description, start, end } = await req.json();

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
      return NextResponse.json({ 
        message: 'Mock: Event created (Integration not configured)',
        event: { summary, start, end }
      }, { status: 200 });
    }

    const event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: end,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
    };

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Calendar POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
