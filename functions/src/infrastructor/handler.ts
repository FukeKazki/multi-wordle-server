import { Client, WebhookEvent } from "@line/bot-sdk";
import { MessageEvent } from "@line/bot-sdk";
import { lineConfig } from "../config/line";
import { MessageController } from "../interfaces/controllers/MessageController";
import { VisionController } from "../interfaces/controllers/VisionController";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { config } from "../config/vision";
import { WordleController } from "../interfaces/controllers/WordleController";
import * as admin from "firebase-admin";
import { DataController } from "../interfaces/controllers/DataContoller";
import { LineDataController } from "../interfaces/controllers/LineRoomController";

export const handlers = async (event: WebhookEvent): Promise<void> => {
  try {
    switch (event.type) {
      case "message":
        return await messagesHandler(event);
      default:
    }
  } catch (err) {
    throw new Error("handlers");
  }
};

const lineClient = new Client(lineConfig);
const messageController = new MessageController(lineClient);
const visionClient = new ImageAnnotatorClient(config);
const visionController = new VisionController(visionClient);
const wordleController = new WordleController();
const firebase = admin.initializeApp();
const lineDataController = new LineDataController(firebase);

const messagesHandler = async (event: MessageEvent): Promise<void> => {
  try {
    switch (event.message.type) {
      case "text":
        if (event.source.type === "group") {
          const groupId = event.source.groupId;
          if (event.message.text === "ゲーム開始") {
            const word = wordleController.generateWordle();
            const room = lineDataController.createRoom(groupId, {
              word: word
            });
            await messageController.replyMessage(
              event.replyToken,
              "ゲーム開始！"
            );
          } else {
            const room = await lineDataController.getRoom(groupId);
            if (!room) {
              return;
            }
            const text = event.message.text;
            if (text === room.word) {
              await messageController.replyMessage(
                event.replyToken,
                "🟩🟩🟩🟩🟩\nゲーム終了！おめでとう！"
              );

              await lineDataController.deleteRoom(groupId);
            }
            const wordle = wordleController.compareWordle(room.word, text);
            const replyText = wordle.reduce((prev, curr) => {
              if (curr.status === "match") return (prev += "🟩");
              if (curr.status === "include") return (prev += "🟨");
              return (prev += "⬛️");
            }, "");

            await messageController.replyMessage(event.replyToken, replyText);
          }
        }
      case "image":
        const { id: messageId } = event.message;
        const buffer = await messageController.getMessageContent(messageId);
        const text = await visionController.getText(buffer);
        if (text) {
          await messageController.replyMessage(event.replyToken, text);
        }
      default:
        return;
    }
  } catch (err) {
    throw new Error("messages handler");
  }
};
