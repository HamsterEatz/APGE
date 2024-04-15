import { getServerSession } from "next-auth";
import getCalendar from "./getCalendar";
import moment from "moment";
import { authOptions } from "../../auth/[...nextauth]/route";

interface EventI {
    eventName: string;
    location?: string;
    description?: string;
    startDate: string;
    endDate: string;
}

export default async function addNewCalendarEventApi({ eventName, location, description, startDate, endDate }: EventI) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('Unauthorized');
    }
    if (moment(startDate).isBefore(moment())) {
        throw new Error('Cannot create event with start date before now!');
    }

    const calendar = await getCalendar();

    const currList = await calendar.events.list({
        calendarId: calendar.calendarId,
        timeZone: 'Asia/Singapore',
        timeMin: new Date(startDate).toISOString(),
        timeMax: new Date(endDate).toISOString(),
        singleEvents: true,
        maxResults: 1
    });

    const currEvent = await currList.data.items;
    if (currEvent && currEvent.length > 0) {
        throw new Error('Cannot overwrite an existing event!');
    }

    const owner = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    const guest = session.user?.email;

    const req: any = {
        calendarId: calendar.calendarId,
        requestBody: {
            summary: eventName,
            location,
            description: `${description}\nCreated by ${guest}`,
            start: {
                dateTime: new Date(startDate).toISOString(),
                timeZone: "Asia/Singapore"
            },
            end: {
                dateTime: new Date(endDate).toISOString(),
                timeZone: "Asia/Singapore"
            },
        }
    };

    const response = await calendar.events.insert(req);

    return response.data.status;
}