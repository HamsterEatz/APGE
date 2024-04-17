import { ref, set } from "firebase/database";
import getUsers from "./getUsers";
import database from "./database";

export default async function createUser(user: string) {
    const { users } = await getUsers();
    if (users.find((v: any) => v === user)) {
        throw new Error('This email is already in the whitelist!');
    }
    return set(ref(database, "users"), [...users, user]);
}