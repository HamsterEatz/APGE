import moment from "moment";
import getCalendar from "./getCalendar";

export default async function getEvents(date: string) {
    const calendar = await getCalendar();
    const mDate = moment(date);
    const start = mDate.clone().startOf('day');
    const end = mDate.clone().endOf('day');

    const res = await calendar.events.list({
        calendarId: calendar.calendarId,
        timeZone: 'Asia/Singapore',
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true
    });

    const resItem = res.data.items?.map((item) => ({
        id: item.id,
        summary: item.summary,
        description: item.description,
        start: item.start,
        end: item.end,
        location: item.location,
        created: item.created,
        updated: item.updated
    }));

    return resItem;
}