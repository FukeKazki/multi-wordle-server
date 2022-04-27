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

  async searchUser(id: string) {
    const usersCollection = this.db.collection("/users");
    const user = await usersCollection.doc(id).get();
    if (!user) return null;
    return user.data();
  }

  async getQueueRooms() {
    const queueRooms = await this.db.collection("/queueRooms").get();
    return queueRooms.docs.map((v) => v.data());
  }

  async deleteQueueRoom(roomId: string) {
    return await this.db.collection("/queueRooms").doc(roomId).delete();
  }

  async createRoom(id: string, data: any) {
    const queueRooms = this.db.collection("/queueRooms");
    return queueRooms.doc(id).set(data);
  }

  async connectRoom(id: string, data: any) {
    const matchedRooms = this.db.collection("/matchedRooms");
    return matchedRooms.doc(id).set(data);
  }

  async getRoom(roomId: string) {
    const room = await this.db.collection("/matchedRooms").doc(roomId).get();
    if (!room) return null;
    return room.data();
  }

  async updateRoom(roomId: string, data: any) {
    return await this.db.collection("/matchedRooms").doc(roomId).set(data);
  }
}
