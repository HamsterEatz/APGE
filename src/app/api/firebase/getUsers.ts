import { ref, get } from "firebase/database";
import database from "./database";

export default async function getUsers() {
    const usersRef = ref(database, '/');
    const data = await get(usersRef);
    if (data.exists()) {
        const { users } = await data.val();
        return {
            users: users.filter(((v: string) => (v === undefined ? null : v)))
        }
    }
    throw new Error('Unable to get users from database!');
}