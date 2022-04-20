import express from "express";
import * as admin from "firebase-admin";
import {v4 as uuidv4} from "uuid";
import { DataController } from "../interfaces/controllers/DataContoller";

export const router = express.Router();

const firebase = admin.initializeApp();
const dataController = new DataController(firebase);

router.get("/", async (req, res) => {
  res.send("hello world");
});

router.post("/user/register", async (req, res) => {
  const name = req.body?.name;
  if (!name) return res.status(403).send("nameがないよ");
  
  const id = uuidv4();

  try {
    await dataController.registerUser(id, {
      name: name,
      uuid: id,
      rate: 0,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send("ユーザー登録で事故りました");
  }
  
  return res.json({
    name: name,
    uuid: id,
    rate: 0,
  });
})

router.get("/room", async (req, res) => {
  const userId = req.body?.id;
  if (!userId) return res.status(403).send("idがないよ");

  // ユーザーの検索
  const user = await dataController.searchUser(userId);
  if(!user) return res.status(403).send("ユーザーが見つかりませんでした");

  // 未マッチのルームを検索
  const queueRooms = await dataController.getQueueRooms();
  // 未マッチのルームがない場合はルーム作成・ある場合はルームに接続
  if (queueRooms.length === 0) {
    const roomId = uuidv4();
    const roomData = {
      room: {
        status: "created",
        id: roomId
      },
      players: [
        {
          name: user?.name,
          uuid: userId,
          rate: user?.rate,
        }
      ]
    }
    // ルームを作成
    await dataController.createRoom(roomId, roomData);
    return res.json(roomData);
  } else {
    const room = queueRooms[0];
    const newRoomData = {
      room: {
        ...room.room,
        status: "matched",
      },
      players: [
        ...room.players,
        {
          name: user?.name,
          uuid: userId,
          rate: user?.rate,
        }
      ]
    }
    
    // ルームに接続
    await dataController.connectRoom(room?.room?.id as string, newRoomData);
    // キューから削除
    await dataController.deleteQueueRoom(room?.room?.id as string);
    return res.json(newRoomData);
  }
});

router.get("/room/:id/info", async (req, res) => {
  res.json({
    "room": {
        "status": "created",
        "id": "xxxx"
    },
    "players": [
        {
            "name": "hoge",
            "uuid": "xxxx",
            "rate": 1000
        }
    ],
    "history": [
        {
            "wordle": [
                {
                    "char": "ぽ",
                    "status": "miss"
                },
                {
                    "char": "あ",
                    "status": "miss"
                },
                {
                    "char": "い",
                    "status": "match" 
                },
                {
                    "char": "う",
                    "status": "include"
                },
                {
                    "char": "え",
                    "status": "miss"
                }
            ]
        }
    ],
    "turnPlayerUuid": "uuid"
  })
})

router.post("/room/:id/answer", async (req, res) => {
  res.json({
    "status": "accept",
    "message": "あたりー"
  })
})