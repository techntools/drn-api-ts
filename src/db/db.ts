import { QueryResult } from "mysql2";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, IS_PRODUCTION } from "../env";
import { COURSES_TABLE, DbResponse, INVENTORY_TABLE } from "./db.model";
import zzz, { and, ZzzResponse } from "zzzql";

zzz.init({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const getInventory = async (
  courses: string[] | undefined,
  names: string[] | undefined,
  discs: string[] | undefined,
  phoneNumbers: string[] | undefined,
  bins: string[] | undefined,
  dateFounds: string[] | undefined,
  dateTexteds: string[] | undefined,
  dateClaimeds: string[] | undefined,
  statuss: string[] | undefined,
  commentss: string[] | undefined,
  colors: string[] | undefined,
  claimBys: string[] | undefined,
  brands: string[] | undefined,
  dateSolds: string[] | undefined,
  reminderTextSents: number[] | undefined,
  frontImages: string[] | undefined,
  backImages: string[] | undefined
): Promise<DbResponse> => {
  try {
    const results: ZzzResponse<QueryResult> = await zzz.q({
      select: {
        table: INVENTORY_TABLE,
        where: [
          { course: { eq: courses } },
          and,
          { disc: { eq: discs } },
          and,
          { phoneNumber: { eq: phoneNumbers } },
          and,
          { bin: { eq: bins } },
          and,
          { name: { eq: names } },
          and,
          { brand: { eq: brands } },
          and,
          { dateFound: { eq: dateFounds } },
          and,
          { dateTexted: { eq: dateTexteds } },
          and,
          { dateClaimed: { eq: dateClaimeds } },
          and,
          { status: { eq: statuss } },
          and,
          { comments: { eq: commentss } },
          and,
          { color: { eq: colors } },
          and,
          { claimBy: { eq: claimBys } },
          and,
          { dateSold: { eq: dateSolds } },
          and,
          { reminderTextSent: { eq: reminderTextSents } },
          and,
          { frontImage: { eq: frontImages } },
          and,
          { backImage: { eq: backImages } },
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
  activeForLostAndFound: number[] | undefined,
  courseName: string[] | undefined,
  state: string[] | undefined,
  city: string[] | undefined,
  shortCode: string[] | undefined,
  createdAt: string[] | undefined,
  updatedAt: string[] | undefined,
  shortLink: string[] | undefined,
  link: string[] | undefined,
  udiscLeagueURL: string[] | undefined
): Promise<DbResponse> => {
  try {
    const results: ZzzResponse<QueryResult> = await zzz.q({
      select: {
        table: COURSES_TABLE,
        where: [
          { orgCode: { eq: orgCode } },
          and,
          { activeForLostAndFound: { eq: activeForLostAndFound } },
          and,
          { courseName: { eq: courseName } },
          and,
          { state: { eq: state } },
          and,
          { city: { eq: city } },
          and,
          { shortCode: { eq: shortCode } },
          and,
          { createdAt: { eq: createdAt } },
          and,
          { updatedAt: { eq: updatedAt } },
          and,
          { shortLink: { eq: shortLink } },
          and,
          { link: { eq: link } },
          and,
          { udiscLeagueURL: { eq: udiscLeagueURL } },
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
