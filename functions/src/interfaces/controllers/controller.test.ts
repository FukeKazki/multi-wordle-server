import { Client, Message, MessageAPIResponseBase } from "@line/bot-sdk";
import { Readable } from "stream";
import { describe, expect, it } from "vitest";
import { lineConfig } from "../../config/line";
import { MessageController } from "./MessageController";

class FakeLineClient extends Client {
  replyMessage(
    replyToken: string,
    messages: Message | Message[],
    notificationDisabled?: boolean
  ): Promise<MessageAPIResponseBase> {
    return Promise.resolve({});
  }
  getMessageContent(messageId: string): Promise<Readable> {
    return Promise.resolve(Readable.from("hello world"));
  }
}

// E2Eテストです。なるべくモックは使わずにテストする。リクエストはモックする。
describe("コントローラーのテスト", () => {
  it("正しく実行できるか", async () => {
    const fakeLineClient = new FakeLineClient(lineConfig);
    const messageController = new MessageController(fakeLineClient);
    const token = "REPLY-TOKEN";
    const message = "こんにちは";

    await expect(
      messageController.replyMessage(token, message)
    ).resolves.toBeUndefined();
  });

  it("Bufferを正しく読めるか", async () => {
    const fakeLineClient = new FakeLineClient(lineConfig);
    const messageController = new MessageController(fakeLineClient);

    const messageId = "test id";
    const expectBuffer = Buffer.from("hello world");

    await expect(
      messageController.getMessageContent(messageId)
    ).resolves.toStrictEqual(expectBuffer);
  });
});
