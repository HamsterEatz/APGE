import whitelist from '../../../../whitelist.json';
import { Session } from "next-auth";

export async function isUserWhitelisted(session: Session) {
    const users = whitelist.users;
    const currentUserEmail = session?.user?.email;
    const ownerEmail = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    if ((currentUserEmail && currentUserEmail === ownerEmail) ||
        (currentUserEmail && users.find((v) => v === currentUserEmail))) {
        return true;
    }
    return false;
}