import mysql from "mysql2/promise";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, IS_PRODUCTION } from "../env";
import {
  COURSES_TABLE,
  DbResponse,
  INVENTORY_TABLE,
  performSelectWhere,
} from "./db.model";

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const getInventory = async (
  courses: string[] | undefined,
  brands: string[] | undefined
): Promise<DbResponse> => {
  try {
    const results = await performSelectWhere(db, INVENTORY_TABLE, [
      { key: "course", values: courses, innerJoin: "OR" },
      { key: "brand", values: brands, innerJoin: "OR" },
    ]);
    return { data: results };
  } catch (e) {
    console.error(e, " error from database query");
    return { errors: [{ code: "", message: "" }] };
  }
};

const postInventory = async (attributes: {
  course: string;
  name: string;
  disc: string;
  phoneNumber: string;
  bin: string;
  comments: string;
  dateFound: string;
  color: string;
  brand: string;
}): Promise<DbResponse> => {
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
};

const patchInventory = async (
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
): Promise<DbResponse> => {
  if (
    "course" in attributes &&
    IS_PRODUCTION === "T" &&
    attributes.course !== "DRN Admins"
  ) {
    throw Error(`IS_PRODUCTION && attributes.course !== "DRN Admins"`);
  }
  try {
    await db.query("START TRANSACTION");
    await db.query(`SELECT 1 FROM ${INVENTORY_TABLE} WHERE id = ? FOR UPDATE`, [
      id,
    ]);
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
};

const getCourses = async (
  orgCode: string[] | undefined,
  activeForLostAndFound: number[] | undefined
): Promise<DbResponse> => {
  try {
    const results = await performSelectWhere(db, COURSES_TABLE, [
      { key: "orgCode", values: orgCode, innerJoin: "OR" },
      {
        key: "activeForLostAndFound",
        values: activeForLostAndFound,
        innerJoin: "OR",
      },
    ]);
    return { data: results };
  } catch (e) {
    console.error(e, " error from database query");
    return { errors: [{ code: "", message: "" }] };
  }
};

export default {
  getInventory,
  postInventory,
  patchInventory,
  getCourses,
};
