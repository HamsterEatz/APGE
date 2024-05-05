import { CALENDAR_TYPE, DAY_STRING } from "@/app/constants";
import moment from "moment";

interface MonthCalendarProps {
    date: moment.Moment,
    events: any,
    setDate: any,
    setActiveDropdownItem: any
}

export default function MonthCalendar({ date, events, setDate, setActiveDropdownItem }: MonthCalendarProps) {
    const startDate = date.clone().startOf('month').startOf('week');
    const today = moment().startOf('day');

    const head = new Array();
    for (let col = 0; col < 7; col++) {
        head.push(<td className="border border-slate-500" key={col}><b>{DAY_STRING.get(col)}</b></td>);
    }

    const body = new Array();
    for (let row = 0; row < 5; row++) {
        const currentWeek = startDate.clone().add(row, 'week');
        const tdArr = new Array();
        for (let col = 0; col < 7; col++) {
            const currentDay = currentWeek.clone().day(col);
            const currentEvents = new Array();
            for (let event of events) {
                if (event && events.length) {
                    const eventStart = event.start;
                    const eventEnd = event.end;
                    const eventStartTime = moment(eventStart!!.dateTime || eventStart.date);
                    const eventEndTime = moment(eventEnd!!.dateTime || eventEnd.date);
                    if (eventStartTime.day() === currentDay.day() &&
                        eventStartTime.week() === currentWeek.week()) {
                        currentEvents.push({ start: eventStartTime, end: eventEndTime });
                    }
                }
            }
            tdArr.push(<td key={col}
                className={`border border-slate-500 h-24 py-2 align-top ${currentDay.isBefore(today) ? "bg-zinc-400" : ""}`}
                onClick={(e) => onDateClick(e, currentDay)}>
                <p className="">{currentDay.date()}</p>
                {currentEvents.map(({ start, end }, i) => {
                    const startFormat = start.format('hh:mm A');
                    const endFormat = end.format("hh:mm A");
                    return <div key={i}>
                        <div className="flex my-1 ml-1">
                            <div className="px-1 mr-1 bg-red-500 rounded-full min-h-2 self-center"></div>
                            <p className="pl-1">{startFormat === endFormat ? "Whole day" : `${startFormat} - ${endFormat}`}</p>
                        </div>
                    </div>
                })}
            </td>);
        }
        body.push(<tr key={row}>{...tdArr}</tr>);
    }

    function onDateClick(e: any, day: moment.Moment) {
        if (day.isSameOrAfter(today)) {
            setDate(day);
            setActiveDropdownItem(CALENDAR_TYPE.DAY);
        }
    }

    return (<div className="py-4">
        <div className="flex pb-3">
            <div className="flex">
                <div className="px-3 bg-red-500 rounded-full"></div>
                <p className="pl-1">Unavailable</p>
            </div>
        </div>
        <table className="table-fixed border-seperate border border-spacing-2 border-slate-500 w-full">
            <thead>
                <tr>
                    {...head}
                </tr>
            </thead>
            <tbody>
                {...body}
            </tbody>
        </table>
    </div>);
}