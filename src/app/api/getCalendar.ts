import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

export default async function getCalendar() {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    const auth = new GoogleAuth({
        credentials: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY!!.split(String.raw`\n`).join('\n')
        },
        scopes: ['https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events']
    });

    const calendar = await google.calendar({ version: 'v3', auth });

    return { calendarId, ...calendar };
}