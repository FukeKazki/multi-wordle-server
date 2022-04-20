import { app } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

export class DataController {
    private db: FirebaseFirestore.Firestore;

    constructor(client: app.App) {
        this.db = getFirestore(client);
    }

    async registerUser(id: string, data: any) {
        const usersCollection = this.db.collection("/users");
        return usersCollection.doc(id).set(data);
    }
}