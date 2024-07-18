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

if (errors.length > 0) {
  throw new Error(`Env vars missing: ${errors.join(", ")}`);
}
