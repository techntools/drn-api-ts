import express from "express";
import { APP_PORT, APP_CORS } from "./env";
import cors from "cors";
import { getInventory } from "./services/inventory/inventory.service";

const app = express();

app.use(express.json());

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: APP_CORS,
    methods: ["GET"],
  })
);

app.get("/", (_req, res) => {
  res.send("healthy");
});

app.get("/inventory", getInventory);

app.listen(APP_PORT, () => {
  return console.log(`Server listening @ http://localhost:${APP_PORT}`);
});
