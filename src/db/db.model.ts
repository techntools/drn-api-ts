import { Pool, QueryResult } from "mysql2/promise";
import { TResponse } from "../app.model";

export const INVENTORY_TABLE = "found_discs";
export const COURSES_TABLE = "courses";

export type DbResponse = TResponse<QueryResult>;
