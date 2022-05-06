import { UserEntity } from "./User";

export interface RoomData {
  id: string;
  users: string[];
  word: string;
}

export class RoomEntity implements RoomData {
  readonly id: string;
  users: string[];
  readonly word: string;

  constructor(id: string, users: any[], word: string) {
    this.id = id;
    this.users = users;
    this.word = word;
  }

  addUser(userId: string) {
    this.users.push(userId);
    return this;
  }

  toObject() {
    return {
      id: this.id,
      users: this.users,
      word: this.word,
    }
  }
}
