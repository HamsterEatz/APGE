import getCalendar from "./getCalendar";
import moment from "moment";

interface EventI {
    eventName: string;
    location?: string;
    description?: string;
    startDate: string;
    endDate: string;
    guest?: string;
}

export default async function addNewCalendarEventApi({ eventName, location, description, startDate, endDate, guest }: EventI) {
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

    const req: any = {
        calendarId: calendar.calendarId,
        requestBody: {
            summary: eventName,
            location,
            description,
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

    if (guest) {
        req[guest] = { attendees: [ { email: guest }] }
    }

    const response = await calendar.events.insert(req);

    return response.data.status;
}