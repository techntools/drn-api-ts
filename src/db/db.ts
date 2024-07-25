import { QueryResult } from "mysql2";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, IS_PRODUCTION } from "../env";
import { COURSES_TABLE, DbResponse, INVENTORY_TABLE } from "./db.model";
import zzz, { and } from "zzzql";
import { ZzzResponse } from "zzzql/src/zzz.model";

zzz.init({
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
    const results: ZzzResponse<QueryResult> = await zzz.q({
      select: {
        table: INVENTORY_TABLE,
        where: [{ course: { eq: courses } }, and, { brand: { eq: brands } }],
      },
    });
    if ("error" in results) {
      throw new Error(JSON.stringify(results.error));
    }
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
    const results: ZzzResponse<QueryResult> = await zzz.q({
      insert: { table: INVENTORY_TABLE, values: attributes },
    });
    if ("error" in results) {
      throw new Error(JSON.stringify(results.error));
    }
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
    const results: ZzzResponse<QueryResult> = await zzz.q({
      transaction: [
        {
          select: {
            table: INVENTORY_TABLE,
            fields: "1",
            where: [{ id: { eq: id } }],
            forUpdate: true,
          },
        },
        {
          update: {
            table: INVENTORY_TABLE,
            set: attributes,
            where: [{ id: { eq: id } }],
          },
        },
      ],
    });
    if ("error" in results) {
      throw new Error(JSON.stringify(results.error));
    }
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
    const results: ZzzResponse<QueryResult> = await zzz.q({
      select: {
        table: COURSES_TABLE,
        where: [
          { orgCode: { eq: orgCode } },
          and,
          { activeForLostAndFound: { eq: activeForLostAndFound } },
        ],
      },
    });
    if ("error" in results) {
      throw new Error(JSON.stringify(results.error));
    }
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
