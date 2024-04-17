import { ref, remove } from "firebase/database";
import getUsers from "./getUsers";
import database from "./database";

export default async function deleteUser(user: string) {
    const { users } = await getUsers();
    const userId = users.findIndex((v: any) => v === user);
    if (userId === -1) {
        throw new Error('No email to delete from whitelist');
    }
    return remove(ref(database, `users/${userId}`));
}