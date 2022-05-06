import { describe, it } from "vitest";
import { RoomEntity } from "./Room";
import { UserEntity } from "./User";

describe("Userエンティティのテスト", () => {
  it("レートが増加するか", () => {
    const user = new UserEntity("lineId", "fukke0906");
    console.log(user);
    const newUser = user.increaseRate().toObject();
    console.log(newUser);
  });
});

describe("Roomエンティティのテスト", () => {
  it("userが追加できるか", () => {
    const room = new RoomEntity("id", [], "wordl");
    console.log(room);
    const newRoom = room.addUser("fukke0906").toObject();
    console.log(newRoom);
    

  })
})
