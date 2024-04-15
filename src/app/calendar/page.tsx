'use client';
import moment from "moment";
import { useEffect, useState } from "react";
import { TimePicker } from "../components";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import path from "path";
import SettingsIcon from '../../../public/settings.svg'

export default function CalendarPage() {
    const [date, setDate] = useState<moment.Moment>();
    const [startTime, setStartTime] = useState<moment.Moment | null>();
    const [endTime, setEndTime] = useState<moment.Moment | null>();
    const [events, setEvents] = useState<any>([]);
    const { data: session } = useSession();

    const owner = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

    useEffect(() => {
        getEvent(date).then((events) => setEvents(events));
    }, [date]);

    async function getEvent(date: moment.Moment | undefined) {
        if (date) {
            const res = await fetch(`/api/calendar?date=${date?.toISOString()}`, {
                method: 'GET',  
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            return data;
        }
    }

    return (<main className='container mx-auto aspect-auto text-center'>
        <div className="inline-flex items-center">
            <h1 className="mx-12 mt-6 text-2xl pb-4 font-bold">Create event</h1>
            <a href="/api/auth/signout" className="border p-2">Sign out</a>
            {session && owner === session.user?.email ? <Link className="ml-12" href="../whitelist">
                <Image alt="" src={SettingsIcon} width={30} height={30} />
                </Link> : <></>}
        </div>
        <form className="mx-12 border" onSubmit={onFormSubmit}>
            <div className="m-4">
                <label htmlFor="eventDate">Event date:</label>
                <input type="date" id="eventDate" name="eventDate" required onChange={onDateChange} />
                {date ?
                    <>
                        <TimePicker events={events} date={date} startTime={startTime} endTime={endTime} setStartTime={setStartTime} setEndTime={setEndTime} />
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
                    : <></>}
            </div>
        </form>
    </main>);

    async function onFormSubmit(e: any) {
        e.preventDefault();
        if (!startTime && !endTime) {
            return alert('Please select time range!');
        }
        const formData = new FormData(e.target);
        formData.append('startDate', startTime!.toString());
        formData.append('endDate', endTime!.toString());
        const res = await fetch(`${location.origin}/api/calendar`, {
            method: 'POST',
            body: formData,
        });
        if (res.status === 201) {
            return alert('Created event');
        }
        return alert(res.statusText);
    }


    async function onDateChange(e: any) {
        const dateSelected = moment(e.target.value);
        setDate(dateSelected);
        setStartTime(null);
        setEndTime(null);
    }
}