import { CALENDAR_TYPE, DAY_STRING } from "@/app/constants";
import moment from "moment";

interface WeekCalendarProps {
    date: moment.Moment,
    setDate: any,
    events: any,
    setActiveDropdownItem: any
}

export default function WeekCalendar({ date, events, setDate, setActiveDropdownItem }: WeekCalendarProps) {
    const startDayOfTheWeek = date.clone().startOf('week');
    const dateHeadingArr: any[] = new Array();
    for (let i = 0; i < 7; i++) {
        const currentMoment = startDayOfTheWeek.clone().day(startDayOfTheWeek.day() + i);
        const currentDate = currentMoment.date();
        dateHeadingArr.push(<td className="border border-slate-500" key={currentDate}>
            <span>
                <div>{DAY_STRING.get(i)}</div>
                <div>{currentDate}</div>
            </span>
        </td>);
    }
    const timeHeadingArr: any[] = new Array();
    for (let hr = 0; hr < 24; hr++) {
        let dateArr = new Array();
        for (let i = 0; i < 7; i++) {
            let pushed = false;
            const currentMoment = startDayOfTheWeek.clone().day(startDayOfTheWeek.day() + i).hour(hr);
            if (events && events?.length) {
                for (const event of events) {
                    const eventStart = event.start;
                    const eventEnd = event.end;
                    const eventStartTime = moment(eventStart!!.dateTime || eventStart.date).startOf('hour');
                    const eventEndTime = moment(eventEnd!!.dateTime || eventEnd.date);
                    if (currentMoment.isSameOrAfter(eventStartTime) && currentMoment.isBefore(eventEndTime)) {
                        dateArr.push(<td className="border border-slate-500 bg-red-500"></td>);
                        pushed = true;
                        break;
                    }
                }
            }
            if (!pushed) {
                const isColBeforeNow = currentMoment.isBefore(moment());
                dateArr.push(<td className={`border border-slate-500 ${isColBeforeNow ? 'bg-zinc-400' : 'bg-lime-500'}`}
                    onClick={() => {
                        if (!isColBeforeNow) {
                            setDate(currentMoment);
                            setActiveDropdownItem(CALENDAR_TYPE.DAY);
                        }
                    }}></td>);
            }
        }
        timeHeadingArr.push(<tr key={hr}>
            <td className="border border-slate-500">{hr < 12 ? `${hr} AM` : hr === 12 ? `${hr} PM` : `${hr - 12} PM`}</td>
            {...dateArr}
        </tr>);
    }

    return (<div className="py-4">
        <div className="flex pb-3">
            <div className="flex">
                <div className="px-3 bg-lime-500"></div>
                <p className="pl-1">Available</p>
            </div>
            <div className="flex pl-2">
                <div className="px-3 bg-red-500"></div>
                <p className="pl-1">Unavailable</p>
            </div>
        </div>
        <table className="table-fixed border-seperate border border-spacing-2 border-slate-500 w-full">
            <thead>
                <tr>
                    <td></td>
                    {...dateHeadingArr}
                </tr>
            </thead>
            <tbody>
                {...timeHeadingArr}
            </tbody>
        </table>
    </div>);
}