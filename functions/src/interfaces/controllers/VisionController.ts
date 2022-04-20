import { ImageAnnotatorClient } from "@google-cloud/vision";

export class VisionController {
  private client: ImageAnnotatorClient;

  constructor(client: ImageAnnotatorClient) {
    this.client = client;
  }

  async getText(content: Buffer): Promise<string | null> {
    try {
      const results = await this.client.textDetection({ image: { content } });
      if (results[0]) {
        const message = results[0].fullTextAnnotation?.text;
        return message ?? null;
      }

      return null;
    } catch (err) {
      if (err instanceof Error) console.error(err.message);
      throw Error;
    }
  }
}
