import { Pool, QueryResult } from "mysql2/promise";
import { TResponse } from "../app.model";

export const BRANDS_TABLE = "brands";
export const DISCS_TABLE = "disc_molds";
export const INVENTORY_TABLE = "found_discs";
export const COURSES_TABLE = "courses";
export const PHONE_OPT_IN_TABLE = "phone_opt_ins";

export type DbResponse = TResponse<QueryResult>;
