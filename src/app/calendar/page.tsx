'use client';
import moment from "moment";
import { useEffect, useState } from "react";
import { DayCalendar, WeekCalendar } from "../components";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SettingsIcon from '../../../public/settings.svg'
import { LoadingModal } from "../components";
import { CALENDAR_TYPE } from "../constants";
import { MonthCalendar } from "../components/calendar";

export default function CalendarPage() {
    const [date, setDate] = useState<moment.Moment>(moment());
    const [startTime, setStartTime] = useState<moment.Moment | null>();
    const [endTime, setEndTime] = useState<moment.Moment | null>();
    const [events, setEvents] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeDropdownItem, setActiveDropdownItem] = useState<CALENDAR_TYPE>(CALENDAR_TYPE.DAY);
    const { data: session } = useSession();

    const owner = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

    useEffect(() => {
        getEvent(date).then((events) => {
            setEvents(events);
            setIsLoading(false);
        });
    }, [date, activeDropdownItem]);

    async function getEvent(date: moment.Moment | undefined) {
        try {
            if (date) {
                let start = date?.toISOString();
                let end = date?.toISOString();
                switch (activeDropdownItem) {
                    case CALENDAR_TYPE.WEEK: {
                        start = date.clone().startOf('week').toISOString();
                        end = date.clone().endOf('week').toISOString();
                        break;
                    }
                    case CALENDAR_TYPE.MONTH: {
                        start = date.clone().startOf('month').startOf('week').toISOString();
                        end = date.clone().endOf('month').endOf('week').toISOString();
                        break;
                    }
                }
                const res = await fetch(`/api/calendar?start=${start}&end=${end}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                return data;
            }
        } catch (e) {
            alert('Something went wrong...');
        }
    }

    return (<main className='container mx-auto aspect-auto text-center'>
        {isLoading ? <LoadingModal /> : <></>}
        <div className="inline-flex items-center my-6">
            <h1 className="mx-6 text-2xl font-bold">Create event</h1>
            <a href="/api/auth/signout" className="border mx-2 p-2">Sign out</a>
            {session && owner === session.user?.email ? <Link className="ml-12" href="../whitelist">
                <Image alt="" src={SettingsIcon} width={30} height={30} />
            </Link> : <></>}
        </div>
        <form className="mx-12 border" onSubmit={onFormSubmit}>
            <div className="m-4">
                <label htmlFor="eventDate">Event date:</label>
                <input type="date" id="eventDate" name="eventDate" value={date.format("YYYY-MM-DD")} required onChange={onDateChange} />
                <select className="mx-12 p-2" name="calendarType" id="calendarType" value={activeDropdownItem}
                    onChange={(e) => {
                        setActiveDropdownItem(e.currentTarget.value as CALENDAR_TYPE);
                        setIsLoading(true);
                    }}>
                    {...Object.keys(CALENDAR_TYPE).map((v, k) => (
                        <option value={v} key={k}>{v.charAt(0) + v.slice(1).toLowerCase()}</option>))}
                </select>
                {activeDropdownItem === CALENDAR_TYPE.DAY ?
                    <>
                        <DayCalendar events={events} date={date} startTime={startTime} endTime={endTime} setStartTime={setStartTime} setEndTime={setEndTime} />
                        <div className="py-4">
                            <label htmlFor="eventName" className="pr-4">Event name:</label>
                            <input type="text" id="eventName" name="eventName" className="rounded-md flex-1 border-0 bg-gray-100 p-2" required></input>
                        </div>
                        <div className="py-4">
                            <label htmlFor="location" className="pr-4">Location:</label>
                            <input type="text" id="eventName" name="location" className="rounded-md flex-1 border-0 bg-gray-100 p-2"></input>
                        </div>
                        <div className="py-4">
                            <label htmlFor="description" id="description" className="pr-4">Description:</label>
                            <textarea id="description" name="description" rows={4} cols={50} className="rounded-md p-2 bg-gray-100 shadow-sm ring-1 ring-gray-300"></textarea>
                        </div>
                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create event</button>
                    </>
                    : activeDropdownItem === CALENDAR_TYPE.WEEK ?
                        <WeekCalendar date={date} events={events} setDate={setDate} setActiveDropdownItem={setActiveDropdownItem} /> :
                        <MonthCalendar date={date} events={events} setDate={setDate} setActiveDropdownItem={setActiveDropdownItem} />}
            </div>
        </form>
    </main>);

    async function onFormSubmit(e: any) {
        e.preventDefault();
        if (!startTime && !endTime) {
            return alert('Please select time range!');
        }
        setIsLoading(true);
        const formData = new FormData(e.target);
        formData.append('startDate', startTime!.toString());
        formData.append('endDate', endTime!.toString());
        const res = await fetch(`${location.origin}/api/calendar`, {
            method: 'POST',
            body: formData,
        });
        if (res.status === 201) {
            alert('Created event');
        } else {
            alert(res.statusText);
        }

        return location.reload();
    }


    async function onDateChange(e: any) {
        setIsLoading(true);
        const dateSelected = moment(e.target.value);
        setDate(dateSelected);
        setStartTime(null);
        setEndTime(null);
    }
}