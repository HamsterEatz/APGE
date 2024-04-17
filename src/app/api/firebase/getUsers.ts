import { ref, get } from "firebase/database";
import database from "./database";

export default async function getUsers() {
    const usersRef = ref(database, '/');
    const data = await get(usersRef);
    if (data.exists()) {
        return data.val();
    }
    throw new Error('Unable to get users from database!');
}