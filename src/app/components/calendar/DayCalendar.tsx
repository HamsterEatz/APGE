import moment from "moment";

export default function DayCalendar(props: any) {
    const { date, startTime, endTime, setStartTime, setEndTime, events } = props;
    const now = moment();

    const timeRowArr = new Array();
    const hourlyQuadArr = new Array();
    for (let k = 0; k < 24; k++) {
        timeRowArr.push(<td className="border border-slate-500">{k === 0 ? 24 : k}</td>);
        const hourlyQuadInnerArr = new Array();
        for (let x = 0; x < 4; x++) {
            const startHour = startTime?.hour();
            const startMinute = startTime?.minute();
            const endHour = endTime?.hour();
            const endMinute = endTime?.minute();
            let bgcondition;

            if ((startHour || startHour === 0) && (!endHour && endHour !== 0)) {
                bgcondition = startHour === k && startMinute === 15 * x;
            } else if (startHour === endHour && startTime) {
                if (startMinute === endMinute) {
                    bgcondition = true;
                } else {
                    bgcondition = startHour === k && endHour === k && ((x * 15) >= startMinute) && (((x + 1) * 15) <= endMinute);
                }
            } else if ((startHour || startHour === 0) && endHour) {
                if (k === startHour) {
                    bgcondition = x * 15 >= startMinute;
                } else if (k === endHour) {
                    bgcondition = (x + 1) * 15 <= endMinute;
                } else {
                    bgcondition = k > startHour && k < endHour;
                }
            }

            hourlyQuadInnerArr.push(<div id={`${k}/${15 * x}`} onClick={onTimeClick}
                className={`border ${bgcondition ? 'bg-cyan-600' : getBgColor(k, x * 15, events)} px-1 py-5 col-start-${x + 1}`} />);
        }
        hourlyQuadArr.push(<td className="border border-slate-500"><div className="grid grid-cols-4">{...hourlyQuadInnerArr}</div></td>);
    }

    function getBgColor(hour: number, min: number, events?: any) {
        if (events && events?.length) {
            for (const event of events) {
                const currDate = date.hour(hour).minute(min);
                let eventStart = moment(event.start.dateTime, moment.ISO_8601, true);
                let eventEnd = moment(event.end.dateTime, moment.ISO_8601, true);

                if ((!eventStart.isValid() && !eventEnd.isValid()) || // If whole day event
                    (eventStart.isSameOrBefore(currDate) && eventEnd.isSameOrAfter(currDate))) {
                    return 'bg-red-500';
                }
            }
            if ((now.isBefore(date.endOf('day')) && now.date() !== date.date()) ||
                (now.isBefore(date.endOf('day')) &&
                    (hour > now.hour() ||
                        hour === now.hour() && min >= now.minute()))) {
                return 'bg-lime-500';
            }
            return 'bg-zinc-400';
        }
        if ((now.isBefore(date.endOf('day')) && now.date() !== date.date()) ||
            (now.isBefore(date.endOf('day')) &&
                (hour > now.hour() ||
                    hour === now.hour() && min >= now.minute()))) {
            return 'bg-lime-500';
        }
        return 'bg-zinc-400';
    }

    function onTimeClick(e: any) {
        const id = e.target.id;
        const [hour, minute] = id.split('/');
        const tempDate = date.clone().hour(Number(hour)).minute(Number(minute));

        if (events && events?.length) {
            for (const event of events) {
                const eventStart = moment(event.start.dateTime);
                const eventEnd = moment(event.end.dateTime);
                if (startTime && !endTime && eventStart.isAfter(startTime) && tempDate.isAfter(eventStart)) {
                    return;
                }
                if ((!startTime || endTime) && tempDate.isSameOrAfter(eventStart) && tempDate.isSameOrBefore(eventEnd)) {
                    return;
                }
            }
        }

        if (tempDate.isBefore(now)) {
            return;
        }

        if (!startTime) {
            setStartTime(tempDate);
        } else if (!endTime) {
            if (tempDate.isBefore(startTime) && !tempDate.isSame(startTime)) {
                return alert("End time cannot be earlier than start time!");
            }
            setEndTime(tempDate.minute(15 + Number(minute)));
        } else {
            setStartTime(tempDate);
            setEndTime(null);
        }
    }

    return (<div className="pt-4">
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
            <caption className="caption-bottom">
                {endTime ? `Selected ${startTime?.hour()}:${startTime?.minute() === 0 ? '00' : startTime?.minute()}hrs - ${endTime?.hour()}:${endTime?.minute() === 0 ? '00' : endTime?.minute()}hrs` : ''}
            </caption>
            <tbody>
                <tr>
                    <td></td>
                    <td colSpan={12} className="border border-slate-500">AM</td>
                    <td colSpan={12} className="border border-slate-500">PM</td>
                </tr>
                <tr>
                    <td></td>
                    {...timeRowArr}
                </tr>
                <tr>
                    <td>{date.format('DD MMMM YYYY')}</td>
                    {...hourlyQuadArr}
                </tr>
                <tr>
                    <td></td>
                    {...timeRowArr}
                </tr>
                <tr>
                    <td></td>
                    <td colSpan={12} className="border border-slate-500">AM</td>
                    <td colSpan={12} className="border border-slate-500">PM</td>
                </tr>
            </tbody>
        </table>
    </div>);
}