import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.send("hello world");
});

router.post("/user/register", async (req, res) => {
  res.json({
    "name": "hoge",
    "uuid": "xxxx"
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