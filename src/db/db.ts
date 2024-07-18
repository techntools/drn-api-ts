import mysql, { QueryResult } from "mysql2/promise";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "../env";

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export default {
  getInventory: async (
    course: string
  ): Promise<{ data: QueryResult } | { errors: object[] }> => {
    try {
      const [results, _fields] = await db.query(
        "SELECT * FROM found_discs WHERE course = (?)",
        [course]
      );
      return { data: results };
    } catch (e) {
      console.error(e, " error from database query");
      return { errors: [{ code: "", message: "" }] };
    }
  },
};
