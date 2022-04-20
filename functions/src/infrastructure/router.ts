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
  if (!name) return res.status(403);
  
  const id = uuidv4();
  
  try {
    await dataController.registerUser(id, {
      name: name,
      uuid: id,
    });
  } catch (e) {
    console.error(e);
    return res.status(500);
  }
  
  return res.json({
    name: name,
    uuid: id
  });
})

router.get("/room", async (req, res) => {
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
        },
        {
            "name": "fuga",
            "uuid": "xxxx",
            "rate": 1000
        }
    ]
  })
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