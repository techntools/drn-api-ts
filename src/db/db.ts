import mysql, { QueryResult } from "mysql2/promise";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, IS_PRODUCTION } from "../env";
import { INVENTORY_TABLE } from "./db.model";

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export default {
  getInventory: async (
    courses: string[]
  ): Promise<{ data: QueryResult } | { errors: object[] }> => {
    try {
      const [results, _fields] = await db.query(
        `SELECT * FROM ${INVENTORY_TABLE} WHERE ${courses
          .map(() => `course = (?)`)
          .join(" OR ")}`,
        [...courses]
      );
      return { data: results };
    } catch (e) {
      console.error(e, " error from database query");
      return { errors: [{ code: "", message: "" }] };
    }
  },

  postInventory: async (attributes: {
    course: string;
    name: string;
    disc: string;
    phoneNumber: string;
    bin: string;
    comments: string;
    dateFound: string;
    color: string;
    brand: string;
  }): Promise<{ data: QueryResult } | { errors: object[] }> => {
    if (IS_PRODUCTION === "T" && attributes.course !== "DRN Admins") {
      throw Error(`IS_PRODUCTION && attributes.course !== "DRN Admins"`);
    }
    try {
      const [results, _fields] = await db.query(
        `
        INSERT INTO ${INVENTORY_TABLE}
        (course, name, disc, phoneNumber, bin, comments, dateFound, color, brand)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          attributes.course,
          attributes.name,
          attributes.disc,
          attributes.phoneNumber,
          attributes.bin,
          attributes.comments,
          attributes.dateFound,
          attributes.color,
          attributes.brand,
        ]
      );
      return { data: results };
    } catch (e) {
      console.error(e, " error from database query");
      return { errors: [{ code: "", message: "" }] };
    }
  },
};
