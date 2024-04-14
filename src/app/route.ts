import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/calendar');
    }
    redirect('/api/auth/signin');
}