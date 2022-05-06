import { app } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { RoomData, RoomEntity } from "../../entity/Room";
import { UserData, UserEntity } from "../../entity/User";

export class LineDataController {
  private db: FirebaseFirestore.Firestore;

  constructor(client: app.App) {
    this.db = getFirestore(client);
  }

  async createRoom(roomId: string, data: RoomData) {
    const roomRef = this.db.collection("lineRooms");
    return roomRef.doc(roomId).set(data);
  }

  async getRoom(roomId: string) {
    const roomRef = this.db.collection("lineRooms");
    const room = await roomRef.doc(roomId).get();
    if (!room) return null;
    const roomData = room.data();
    return new RoomEntity(roomData?.id, roomData?.users, roomData?.word);
    // return room.data() as RoomEntity;
  }

  async registerUser(lineId: string, user: UserData) {
    const userRef = this.db.collection("/lineUsers");
    return userRef.doc(lineId).set(user);
  }

  async findUser(lineId: string) {
    const userRef = this.db.collection("/lineUsers");
    const user = await userRef.doc(lineId).get();
    if (!user) return null;
    return user.data();
  }

  async getUser(lineId: string) {
    const userRef = this.db.collection("/lineUsers");
    const user = await userRef.doc(lineId).get();
    if (!user) return null;
    const userData = user.data();
    return new UserEntity(userData?.lineId, userData?.name, userData?.rate);
  }

  async deleteRoom(roomId: string) {
    return await this.db.collection("lineRooms").doc(roomId).delete();
  }
}
