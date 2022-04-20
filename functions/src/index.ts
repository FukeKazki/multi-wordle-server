import express from "express";
import { router } from "./infrastructure/router";
import * as functions from "firebase-functions";

const app = express();

app.use(router);

export const wordle = functions
  .region("asia-northeast1")
  .https.onRequest(app);
