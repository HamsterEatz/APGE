import { NextRequest } from 'next/server';
import { addEvent } from './model';
import getEvents from './model/getEvents';

export async function GET(req: NextRequest) {
    try {
        const date = await req.nextUrl.searchParams?.get('date');
        if (date) {
            const data = await getEvents(date);
            return new Response(JSON.stringify(data));
        }
        throw new Error('Date not defined!');
    } catch (e: any) {
        return new Response(null, { status: 401, statusText: e.message  });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req?.formData();
        if (!formData) {
            throw new Error('Missing payload!');
        }
        let payload: any = {};
        formData.forEach((v, k) => payload[k] = v);
        const calRes = await addEvent(payload as any);
        return new Response(calRes, { status: 201 });
    } catch (e: any) {
        return new Response(null, { status: 401, statusText: e.message  });
    }
}