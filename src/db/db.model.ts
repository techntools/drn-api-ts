import { Pool, QueryResult } from "mysql2/promise";
import { TResponse } from "../app.model";

export const INVENTORY_TABLE = "found_discs";
export const COURSES_TABLE = "courses";

export type DbResponse = TResponse<QueryResult>;

type whereClause = {
  key: string;
  values: unknown[] | undefined;
  innerJoin: "OR";
};

const generateWhereClause = (data: whereClause[]): string | null => {
  const whereClause = data
    .map(({ key, values, innerJoin }) => {
      const generated =
        values?.map(() => `${key} = (?)`).join(` ${innerJoin} `) ?? "";
      return generated ? `(${generated})` : "";
    })
    .filter((e) => e !== "")
    .join(" AND ");
  return whereClause || null;
};

export const performSelectWhere = async (
  db: Pool,
  table: string,
  queryData: whereClause[],
  fields?: string
): Promise<QueryResult> => {
  const whereClause = generateWhereClause(queryData);
  const [results, _fields] = await db.query(
    `SELECT ${fields || "*"} FROM ${table}${
      whereClause ? " WHERE " + whereClause : ""
    }`,
    [
      ...(whereClause
        ? queryData
            .map((e) => e.values)
            .flat()
            .filter((e) => e !== undefined)
        : []),
    ]
  );
  return results;
};
