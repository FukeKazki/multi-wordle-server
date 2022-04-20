import { Client, Message } from "@line/bot-sdk";

const makeReplyMessage = (text: string): Message => {
  return {
    type: "text",
    text: text.replace(/<br>/g, "\n")
  };
};

export class MessageController {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async replyMessage(token: string, text: string): Promise<void> {
    this.client.replyMessage(token, makeReplyMessage(text));
  }

  async getMessageContent(messageId: string): Promise<Buffer> {
    return new Promise((resolve, reject) =>
      this.client
        .getMessageContent(messageId)
        .then((stream) => {
          const content: Buffer[] = [];
          stream.on("data", (chunk) => content.push(Buffer.from(chunk)));
          stream.on("end", () => resolve(Buffer.concat(content)));
          stream.on("error", (err) => {
            reject("lineGetContent");
          });
        })
        .catch((err) => {
          reject("lineGetContent");
        })
    );
  }
}
