const errors: string[] = [];

if (!process.env.APP_PORT) {
  errors.push("APP_PORT");
}
export const APP_PORT = process.env.APP_PORT;

if (!process.env.APP_CORS) {
  errors.push("APP_CORS");
}
export const APP_CORS = process.env.APP_CORS.split(",");

if (!process.env.DB_HOST) {
  errors.push("DB_HOST");
}
export const DB_HOST = process.env.DB_HOST;

if (!process.env.DB_USER) {
  errors.push("DB_USER");
}
export const DB_USER = process.env.DB_USER;

if (!process.env.DB_PASSWORD) {
  errors.push("DB_PASSWORD");
}
export const DB_PASSWORD = process.env.DB_PASSWORD;

if (!process.env.DB_NAME) {
  errors.push("DB_NAME");
}
export const DB_NAME = process.env.DB_NAME;

// default to true if no value in .env to be safe
export const IS_PRODUCTION = process.env.IS_PRODUCTION || "T";

if (!process.env.AUTH_ISSUER) {
  errors.push("AUTH_ISSUER");
}
export const AUTH_ISSUER = process.env.AUTH_ISSUER;

if (!process.env.AUTH_AUDIENCE) {
  errors.push("AUTH_AUDIENCE");
}
export const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE;

if (!process.env.TWILIO_SID) {
  errors.push("TWILIO_SID");
}
export const TWILIO_SID = process.env.TWILIO_SID;

if (!process.env.TWILIO_AUTH_TOKEN) {
  errors.push("TWILIO_AUTH_TOKEN");
}
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

if (!process.env.TWILIO_SEND_FROM) {
  errors.push("TWILIO_SEND_FROM");
}
export const TWILIO_SEND_FROM = process.env.TWILIO_SEND_FROM;

if (!process.env.TWILIO_WEBHOOK_URL) {
  errors.push("TWILIO_WEBHOOK_URL");
}
export const TWILIO_WEBHOOK_URL = process.env.TWILIO_WEBHOOK_URL;

if (errors.length > 0) {
  throw new Error(`Env vars missing: ${errors.join(", ")}`);
}
