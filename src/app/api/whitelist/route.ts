import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NextRequest } from "next/server";
import { getUsers, createUser, deleteUser } from "../firebase";

export async function GET() {
    try {
        return new Response(JSON.stringify(await getUsers()), { status: 203 });
    } catch (e: any) {
        return new Response(null, { status: 500, statusText: e.message });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const owner = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    
        if (!session || session.user?.email !== owner) {
            throw new Error('Unauthorized!');
        }

        const formData = await req.formData();
        const email = formData.get('email')?.toString();
        if (!email) {
            throw new Error('Missing email');
        }

        await createUser(email);

        return new Response(null, { status: 201, statusText: `${email} added into whitelist!`});
    } catch (e: any) {
        return new Response(null, { status: 500, statusText: e.message });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const owner = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    
        if (!session || session.user?.email !== owner) {
            throw new Error('Unauthorized!');
        }
        const { email } = await req.json();

        await deleteUser(email);
        return new Response(null, { status: 204, statusText: `${email} deleted`})
    } catch (e: any) {
        return new Response(null, { status: 401, statusText: e.message });
    }
}