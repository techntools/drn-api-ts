import express from "express";
import { APP_PORT, APP_CORS, AUTH_ISSUER, AUTH_AUDIENCE } from "./env";
import cors from "cors";
import {
  getInventory,
  patchInventory,
  postInventory,
} from "./services/inventory/inventory.service";
import * as OpenApiValidator from "express-openapi-validator";
import openApiSpec from "./api.json";
import { getCourses } from "./services/courses/courses.service";
import { postImageText } from "./services/ai/ai.service";
import { getBrands } from "./services/brands/brands.service";
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();

app.use(express.json({ limit: "5mb" }));

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

const requireLogin = auth({
  issuerBaseURL: AUTH_ISSUER,
  audience: AUTH_AUDIENCE,
});

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: APP_CORS,
    methods: ["GET", "POST", "PATCH"],
  })
);

app.get("/health-check", (_req, res) => {
  // TODO: check db connection
  res.send("healthy");
});

app.get("/brands", getBrands);

app.get("/inventory", getInventory);
app.post("/inventory", requireLogin, postInventory);
app.patch("/inventory/:itemId", requireLogin, patchInventory);

app.get("/courses", getCourses);

app.post("/ai/image", requireLogin, postImageText);

app.listen(APP_PORT, () => {
  return console.log(`Server listening @ http://localhost:${APP_PORT}`);
});
