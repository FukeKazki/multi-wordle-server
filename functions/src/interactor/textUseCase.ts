import { Client, MessageEvent } from "@line/bot-sdk";
import { LineDataController } from "../interfaces/controllers/LineRoomController";
import { app } from "../extra/firebase";
import { WordleController } from "../interfaces/controllers/WordleController";
import { RoomEntity } from "../entity/Room";
import { MessageController } from "../interfaces/controllers/MessageController";
import { lineConfig } from "../config/line";
import { UserEntity } from "../entity/User";

const lineDataController = new LineDataController(app);
const wordleController = new WordleController();
const lineClient = new Client(lineConfig);
const messageController = new MessageController(lineClient);

export const textUseCase = async (event: MessageEvent) => {
  if (event.message.type !== "text") return;
  if (event.source.type !== "group") return;
  const { groupId, userId } = event.source;
  if (!userId) return;

  const text = event.message.text;
  if (text === "ゲーム開始") {
    // 答えを生成
    const word = wordleController.generateWordle();
    // 部屋の作成
    const roomEntity = new RoomEntity(groupId, ids, word);
    // 部屋の保存
    lineDataController.createRoom(groupId, roomEntity.toObject());
    // 返信する
    messageController.replyMessage(event.replyToken, "ゲーム開始！");
  } else {
    // 部屋を取得
    const room = await lineDataController.getRoom(groupId);
    if (!room) return;

    // 正解のとき
    if (text === room.word) {
      let replytext = "";
      // レートの計算
      for (const roomUserId of room.users) {
        const user = await lineDataController.getUser(roomUserId);
        if (!user) return;
        if (user?.lineId === userId) {
          // 正解したユーザーのレートを上げる
          lineDataController.registerUser(
            user?.lineId,
            user.increaseRate().toObject()
          );
          replytext += `・${user.name}: ${user.rate} (+50)`;
        } else {
          // レートを下げる
          lineDataController.registerUser(
            roomUserId,
            user.decreaseRate().toObject()
          );
          replytext += `・${user.name}: ${user.rate} (-10)`;
        }
      }

      // ユーザーのプロフィールを取得
      const profile = await lineClient.getGroupMemberProfile(groupId, userId);
      // 返信する
      messageController.replyMessage(
        event.replyToken,
        `🟩🟩🟩🟩🟩\nゲーム終了！${profile.displayName}さんおめでとう！\n${replytext}`
      );

      // ルームを削除
      lineDataController.deleteRoom(groupId);
    } else {
      // 不正解のとき
      // ワードの比較
      const wordle = wordleController.compareWordle(room.word, text);
      const replyText = wordle.reduce((prev, curr) => {
        if (curr.status === "match") return (prev += "🟩");
        if (curr.status === "include") return (prev += "🟨");
        return (prev += "⬛️");
      }, "");

      // 返信
      messageController.replyMessage(event.replyToken, replyText);
    }

    // ユーザーの検索
    lineDataController.findUser(userId).then(async (user) => {
      if (!user) {
        // プロフィールの取得
        const profile = await lineClient.getProfile(userId);
        // ユーザーの登録
        const newUser = new UserEntity(userId, profile.displayName).toObject();
        await lineDataController.registerUser(userId, newUser);
      }
    });

    // ユーザーをルームに追加
    if (!room.users.includes(userId)) {
      await lineDataController.createRoom(
        groupId,
        room.addUser(userId).toObject()
      );
    }
  }
};
