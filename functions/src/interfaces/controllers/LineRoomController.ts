import { app } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

export class LineDataController {
  private db: FirebaseFirestore.Firestore;

  constructor(client: app.App) {
    this.db = getFirestore(client);
  }

  async createRoom(roomId: string, data: any) {
    const roomRef = this.db.collection("lineRooms");
    return roomRef.doc(roomId).set(data);
  }

  async getRoom(roomId: string) {
    const roomRef = this.db.collection("lineRooms");
    const room = await roomRef.doc(roomId).get();
    if (!room) return null;
    return room.data();
  }

  async deleteRoom(roomId: string) {
    return await this.db.collection("lineRooms").doc(roomId).delete();
  }
}
