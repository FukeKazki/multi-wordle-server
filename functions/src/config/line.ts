import "dotenv/config";
import type { ClientConfig, MiddlewareConfig } from "@line/bot-sdk";

export const lineMiddlewareConfig: MiddlewareConfig = {
  channelSecret: process.env.LINE_MESSAGING_CHANNEL_SECRET as string
};

export const lineConfig: ClientConfig = {
  ...lineMiddlewareConfig,
  channelAccessToken: process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN as string
};
