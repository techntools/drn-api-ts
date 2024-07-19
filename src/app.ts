import express from "express";
import { APP_PORT, APP_CORS } from "./env";
import cors from "cors";
import {
  getInventory,
  postInventory,
} from "./services/inventory/inventory.service";
import * as OpenApiValidator from "express-openapi-validator";
import openApiSpec from "./api.json";

const app = express();
app.use(express.json());

const apiSpec = openApiSpec as any; // TODO: use yaml by path (best) or import (last)
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
  })
);

app.use((err, req, res, next) => {
  console.error(err, "api spec error");
  // TODO: decide if want to return this message
  //        or something more generic
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: APP_CORS,
    methods: ["GET", "POST"],
  })
);

app.get("/", (_req, res) => {
  res.send("healthy");
});

app.get("/inventory", getInventory);
app.post("/inventory", postInventory);

app.listen(APP_PORT, () => {
  return console.log(`Server listening @ http://localhost:${APP_PORT}`);
});
