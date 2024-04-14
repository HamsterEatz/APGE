import addNewCalendarEventApi from '../../api/addEvent';

export async function POST(req: Request) {
    try {
        const formData = await req?.formData();
        if (!formData) {
            throw new Error('Missing payload!');
        }
        let payload: any = {};
        formData.forEach((v, k) => payload[k] = v);
        const calRes = await addNewCalendarEventApi(payload as any);
        return new Response(calRes, { status: 201 });
    } catch (e: any) {
        return new Response(null, { status: 401, statusText: e.message  });
    }
}