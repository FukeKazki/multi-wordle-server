import { Client, JoinEvent, WebhookEvent } from "@line/bot-sdk";
import { MessageEvent } from "@line/bot-sdk";
import { lineConfig } from "../config/line";
import { MessageController } from "../interfaces/controllers/MessageController";
import { VisionController } from "../interfaces/controllers/VisionController";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { config } from "../config/vision";
import { textUseCase } from "../interactor/textUseCase";
import { LineDataController } from "../interfaces/controllers/LineRoomController";
import { app } from "../extra/firebase";
import { UserEntity } from "../entity/User";

export const handlers = async (event: WebhookEvent): Promise<void> => {
  try {
    console.log(event.type);

    switch (event.type) {
      case "message":
        return await messagesHandler(event);
      case "join":
        return await joinHandler(event);
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
const lineDataController = new LineDataController(app);

const messagesHandler = async (event: MessageEvent): Promise<void> => {
  try {
    switch (event.message.type) {
      case "text":
        textUseCase(event);
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

const joinHandler = async (event: JoinEvent): Promise<void> => {
  try {
    console.log("joinhandler", event);
    if (event.source.type === "group") {
      const { groupId } = event.source;
      const userIds = await lineClient
        .getGroupMemberIds(groupId)
        .catch((err) => {
          console.log(err);
          return [];
        });
      console.log("userIds", userIds);

      for (const ids of userIds) {
        const profile = await lineClient.getGroupMemberProfile(groupId, ids);
        const user = new UserEntity(ids, profile.displayName).toObject();
        lineDataController.registerUser(ids, user);
      }
    }
  } catch (err) {
    throw new Error("join handler");
  }
};
