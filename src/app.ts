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
import { healthCheck } from "./db/db";
import { getDiscs } from "./services/discs/discs.service";

const app = express();

app.use(express.json({ limit: "5mb" }));

const apiSpec = openApiSpec as any; // TODO: use yaml by path (best) or import (last)

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

const requireLogin = auth({
  issuerBaseURL: AUTH_ISSUER,
  audience: AUTH_AUDIENCE,
});

const requireOrgAuth = (getOrgCode: (r) => Promise<string>) => {
  return async (req, res, next) => {
    const userOrgCodeRaw = req.auth?.payload?.org_code;
    if (typeof userOrgCodeRaw !== "string" || !userOrgCodeRaw) {
      res.status(400).send({
        errors: [{ code: "no_org_code", message: "no org in auth" }],
      });
      return;
    }
    const userOrgCode = userOrgCodeRaw.trim();
    if (!userOrgCode) {
      res.status(400).send({
        errors: [{ code: "no_org_code", message: "no org in auth" }],
      });
      return;
    }
    const recordOrgCode = await getOrgCode(req);
    if (userOrgCode === recordOrgCode) {
      next();
    } else {
      res.status(403).send({
        errors: [{ code: "403", message: "unauthorized" }],
      });
    }
  };
};

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

app.get("/discs", ...apiSpecMiddleware, getDiscs);

app.get("/brands", ...apiSpecMiddleware, getBrands);

app.get("/inventory", ...apiSpecMiddleware, getInventory);
app.post(
  "/inventory",
  requireLogin,
  requireOrgAuth(async (r) => "org_6108516784ae"),
  ...apiSpecMiddleware,
  postInventory
);
app.patch(
  "/inventory/:itemId",
  requireLogin,
  requireOrgAuth(async (r) => "org_6108516784ae"),
  ...apiSpecMiddleware,
  patchInventory
);

app.get("/courses", ...apiSpecMiddleware, getCourses);

app.post("/ai/image", requireLogin, ...apiSpecMiddleware, postImageText);

app.listen(APP_PORT, () => {
  return console.log(`Server listening @ http://localhost:${APP_PORT}`);
});
