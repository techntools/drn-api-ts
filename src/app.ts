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
import db, { healthCheck } from "./db/db";
import disc from "./services/discs/controller";
import { requireOrgAuth } from "./middleware";
import {
  getPhoneOptIns,
  handleTwilioSms,
  postSms,
  putPhoneOptIn,
} from "./services/sms/sms.service";
import bodyParser from "body-parser";
import { vcard } from "./vcard";

import config from "./config";
import store from "./store";

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

const apiSpec = openApiSpec as any; // TODO: use yaml by path (best) or import (last)

/**
 * middleware that enforces in the {@link openApiSpec}
 */
const apiSpecMiddleware = [
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
  (err, req, res, next) => {
    console.error(err, "api spec error");
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  },
];

/**
 * middleware that requires a minimal valid auth token
 */
const requireLogin = auth({
  issuerBaseURL: AUTH_ISSUER,
  audience: AUTH_AUDIENCE,
});

/**
 * cors middleware
 */
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: [...APP_CORS, /\.discrescuenetwork\.com$/],
    methods: ["GET", "POST", "PATCH"],
  })
);

app.get("/health-check", async (_req, res) => {
  const dbResponse = await healthCheck();
  if ("errors" in dbResponse) {
    res.status(500).send("sick");
    return;
  }
  res.send("healthy");
});

app.get("/discs", ...apiSpecMiddleware, disc.findAll);

app.get("/brands", ...apiSpecMiddleware, getBrands);

app.get("/inventory", ...apiSpecMiddleware, getInventory);
app.post("/inventory", requireLogin, ...apiSpecMiddleware, postInventory);
app.patch(
  "/inventory/:itemId",
  requireLogin,
  requireOrgAuth(async (req, res) => {
    const itemId = Number(req.params?.itemId);
    if (!itemId || isNaN(itemId)) {
      res.status(400).send({
        errors: [
          { code: "no_inventory_item_id", message: "no itemId in path" },
        ],
      });
      return null;
    }
    const dbResponse = await db.getInventory(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      [itemId],
      undefined
    );
    if (
      "errors" in dbResponse ||
      !Array.isArray(dbResponse.data) ||
      dbResponse.data.length > 1 ||
      !dbResponse.data.every((d) => typeof d === "object" && "orgCode" in d)
    ) {
      res.status(500).send();
      return null;
    }
    return (dbResponse.data[0] as { orgCode: string }).orgCode;
  }),
  ...apiSpecMiddleware,
  patchInventory
);

app.get("/courses", ...apiSpecMiddleware, getCourses);

app.post("/ai/image", requireLogin, ...apiSpecMiddleware, postImageText);

app.get("/phone-opt-ins", getPhoneOptIns);
app.post("/phone-opt-ins/twilio", handleTwilioSms);
app.get("/phone-opt-ins/twilio/vcf", async (req, res) => {
  res.setHeader("Content-Type", "text/vcard");
  res.send(vcard);
});
app.put("/phone-opt-ins", requireLogin, ...apiSpecMiddleware, putPhoneOptIn);
app.post("/sms", requireLogin, ...apiSpecMiddleware, postSms);

app.listen(APP_PORT, async () => {
  await config.init()
  await store.init()
  return console.log(`Server listening @ http://localhost:${APP_PORT}`);
});
