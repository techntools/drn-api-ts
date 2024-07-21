import mysql, { QueryResult } from "mysql2/promise";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, IS_PRODUCTION } from "../env";
import { COURSES_TABLE, INVENTORY_TABLE } from "./db.model";

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export default {
  getInventory: async (
    courses: string[] | undefined
  ): Promise<{ data: QueryResult } | { errors: object[] }> => {
    try {
      let whereClause = courses?.map(() => `course = (?)`).join(" OR ") ?? "";
      if (whereClause) {
        whereClause = `WHERE ${whereClause}`;
      }
      const [results, _fields] = await db.query(
        `SELECT * FROM ${INVENTORY_TABLE} ${whereClause}`.trim(),
        [...(whereClause ? courses : [])]
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

  patchInventory: async (
    id: number,
    attributes: {
      course?: string;
      name?: string;
      disc?: string;
      phoneNumber?: string;
      bin?: string;
      comments?: string;
      dateFound?: string;
      color?: string;
      brand?: string;
    }
  ): Promise<{ data: QueryResult } | { errors: object[] }> => {
    if (
      "course" in attributes &&
      IS_PRODUCTION === "T" &&
      attributes.course !== "DRN Admins"
    ) {
      throw Error(`IS_PRODUCTION && attributes.course !== "DRN Admins"`);
    }
    try {
      await db.query("START TRANSACTION");
      await db.query(
        `SELECT 1 FROM ${INVENTORY_TABLE} WHERE id = ? FOR UPDATE`,
        [id]
      );
      const setClause = Object.keys(attributes)
        .map((key) => `${key} = ?`)
        .join(", ");
      const [results, _fields] = await db.query(
        `UPDATE ${INVENTORY_TABLE} SET ${setClause} WHERE id = ?`,
        [...Object.values(attributes), id]
      );
      await db.query("COMMIT");
      return { data: results };
    } catch (e) {
      console.error(e, " error from database query");
      return { errors: [{ code: "", message: "" }] };
    }
  },

  getCourses: async (): Promise<
    { data: QueryResult } | { errors: object[] }
  > => {
    try {
      const [results, _fields] = await db.query(
        `SELECT * FROM ${COURSES_TABLE}`
      );
      return { data: results };
    } catch (e) {
      console.error(e, " error from database query");
      return { errors: [{ code: "", message: "" }] };
    }
  },
};
