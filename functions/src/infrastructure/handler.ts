import { Client, WebhookEvent } from "@line/bot-sdk";
import { MessageEvent } from "@line/bot-sdk";
import { lineConfig } from "../config/line";
import { MessageController } from "../interfaces/controllers/MessageController";
import { VisionController } from "../interfaces/controllers/VisionController";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { config } from "../config/vision";

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

const messagesHandler = async (event: MessageEvent): Promise<void> => {
  try {
    switch (event.message.type) {
      case "text":
        await messageController.replyMessage(
          event.replyToken,
          "クリーンアーキテクチャへようこそ"
        );
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
