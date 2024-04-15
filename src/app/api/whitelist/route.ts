import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NextRequest } from "next/server";
import fs from 'fs';
import path from 'path';
import whitelist from '../../../../whitelist.json';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const owner = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
        const users = whitelist.users;

        if (!session || session.user?.email !== owner) {
            throw new Error('Unauthorized!');
        }

        const formData = await req.formData();
        const email = formData.get('email')?.toString();
        if (!email) {
            throw new Error('Missing email');
        }
        if (users.find((v) => v === email)) {
            throw new Error('This email is already in the whitelist!');
        }
        const json = {
            users: [...users, email]
        };
        fs.writeFileSync(path.resolve(__dirname, '../../../../../whitelist.json'), JSON.stringify(json));
        return new Response(null, { status: 201, statusText: `${email} added into whitelist!`});
    } catch (e: any) {
        return new Response(null, { status: 401, statusText: e.message });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const owner = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
        const users = whitelist.users;
        const emailToDelete = await req.json();

        if (!session || session.user?.email !== owner) {
            throw new Error('Unauthorized!');
        }
        if (!emailToDelete || !emailToDelete?.email) {
            throw new Error('No email to delete from whitelist');
        }

        let json = {
            users: users.filter((user: any) => user !== emailToDelete.email)
        };
        fs.writeFileSync(path.resolve(__dirname, '../../../../../whitelist.json'), JSON.stringify(json));
        return new Response(null, { status: 204, statusText: `${emailToDelete.email} deleted`})
    } catch (e: any) {
        return new Response(null, { status: 401, statusText: e.message });
    }
}