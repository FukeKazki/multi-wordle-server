import { Client } from "@line/bot-sdk";
import express from "express";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { lineConfig } from "../config/line";
import { DataController } from "../interfaces/controllers/DataContoller";
import { MessageController } from "../interfaces/controllers/MessageController";
import { WordleController } from "../interfaces/controllers/WordleController";
import { handlers } from "./handler";

export const router = express.Router();

// const firebase = admin.initializeApp();
// const dataController = new DataController(firebase);
const wordleController = new WordleController();

router.get("/", async (req, res) => {
  res.send("hello world");
});

router.post("/webhook/linebot", async (req, res) => {
  Promise.all(req.body.events.map(handlers))
    .then(() => {
      res.status(200).end();
    })
    .catch(() => {
      res.status(500).end();
    });
});
// router.post("/users/register", async (req, res) => {
//   const name = req.body?.name;
//   if (!name) return res.status(403).send("nameがないよ");

//   const id = uuidv4();

//   try {
//     await dataController.registerUser(id, {
//       name: name,
//       uuid: id,
//       rate: 0
//     });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).send("ユーザー登録で事故りました");
//   }

//   return res.json({
//     name: name,
//     uuid: id,
//     rate: 0
//   });
// });

// router.post("/room", async (req, res) => {
//   const userId = req.body?.id;
//   if (!userId) return res.status(403).send("idがないよ");

//   // ユーザーの検索
//   const user = await dataController.searchUser(userId);
//   if (!user) return res.status(403).send("ユーザーが見つかりませんでした");

//   // 未マッチのルームを検索
//   const queueRooms = await dataController.getQueueRooms();
//   // 未マッチのルームがない場合はルーム作成・ある場合はルームに接続
//   if (queueRooms.length === 0) {
//     // TODO: 答えを決める
//     const word = wordleController.generateWordle();

//     const roomId = uuidv4();
//     const roomData = {
//       room: {
//         status: "created",
//         id: roomId
//       },
//       players: [
//         {
//           name: user?.name,
//           uuid: userId,
//           rate: user?.rate
//         }
//       ],
//       history: [],
//       turnPlayerUuid: userId,
//       word: word
//     };
//     // ルームを作成
//     await dataController.createRoom(roomId, roomData);
//     return res.json(roomData);
//   } else {
//     const room = queueRooms[0];
//     const newRoomData = {
//       ...room,
//       room: {
//         ...room.room,
//         status: "matched"
//       },
//       players: [
//         ...room.players,
//         {
//           name: user?.name,
//           uuid: userId,
//           rate: user?.rate
//         }
//       ],
//       history: [...room.history]
//     };

//     // ルームに接続
//     await dataController.connectRoom(room?.room?.id as string, newRoomData);
//     // キューから削除
//     await dataController.deleteQueueRoom(room?.room?.id as string);
//     return res.json(newRoomData);
//   }
// });

// router.get("/room/:id/info", async (req, res) => {
//   const roomId = req.params?.id;
//   if (!roomId) return res.status(403).send("room idが指定されてないよ");

//   const room = await dataController.getRoom(roomId);
//   if (!room) return res.status(403).send("roomが存在しないよ");

//   return res.json(room);
// });

// router.post("/room/:id/answer", async (req, res) => {
//   const roomId = req.params?.id;
//   if (!roomId) return res.status(403).send("room idが指定されてないよ");

//   const room = await dataController.getRoom(roomId);
//   if (!room) return res.status(403).send("roomが存在しないよ");

//   const uuid = req.body?.playerUuid;
//   const answer = req.body?.answer as string;

//   // TODO: answerの各単語をチェックする
//   const wordle = wordleController.compareWordle(room.word, answer);

//   const newRoomData = {
//     ...room,
//     history: [
//       ...room.history,
//       {
//         wordle: wordle
//       }
//     ],
//     turnPlayerUuid: uuid
//   };

//   await dataController.updateRoom(roomId, newRoomData);

//   res.json({
//     status: "accept",
//     message: "あたりー"
//   });
// });

