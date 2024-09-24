import { QueryResult } from "mysql2";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "../env";
import {
  BRANDS_TABLE,
  COURSES_TABLE,
  DISCS_TABLE,
  DbResponse,
  INVENTORY_TABLE,
  PHONE_OPT_IN_TABLE,
} from "./db.model";
import zzz, { and, ZzzResponse } from "zzzql";

/**
 * zzzql pass through to init the mysql2 db pool
 */
zzz.init({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

/**
 * query database for brands in {@link BRANDS_TABLE} with filters
 *
 * @param {string[] | undefined} names brand names
 * @returns {DbResponse} brand data or errors
 */
const getBrands = async (names: string[] | undefined): Promise<DbResponse> => {
  try {
    const results: ZzzResponse<QueryResult> = await zzz.q({
      select: {
        table: BRANDS_TABLE,
        where: [{ BrandName: { eq: names } }],
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

/**
 * get disc molds from the database table {@link DISCS_TABLE} with filters
 *
 * @param {string[] | undefined} names disc mold names
 * @param {number[] | undefined} brandIds brand ids
 * @param {string[] | undefined} brandNames brand names
 * @returns {Promise<DbResponse>} disc mold data or errors
 */
const getDiscs = async (
  names: string[] | undefined,
  brandIds: number[] | undefined,
  brandNames: string[] | undefined
): Promise<DbResponse> => {
  try {
    const results: ZzzResponse<QueryResult> = await zzz.q({
      select: {
        table: DISCS_TABLE,
        where: [
          { MoldName: { eq: names } },
          and,
          { [`${DISCS_TABLE}.BrandID`]: { eq: brandIds } },
          and,
          { [`${BRANDS_TABLE}.BrandName`]: { eq: brandNames } },
        ],
        leftJoin: {
          table: BRANDS_TABLE,
          on: [{ BrandID: { eq: "BrandID" } }],
        },
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

/**
 * query database for inventory in {@link INVENTORY_TABLE}
 *
 * @param {string[] | undefined} courses
 * @param {string[] | undefined} names
 * @param {string[] | undefined} discs
 * @param {string[] | undefined} phoneNumbers
 * @param {string[] | undefined} bins
 * @param {string[] | undefined} dateFounds
 * @param {string[] | undefined} dateTexteds
 * @param {string[] | undefined} dateClaimeds
 * @param {string[] | undefined} statuss
 * @param {string[] | undefined} commentss
 * @param {string[] | undefined} colors
 * @param {string[] | undefined} claimBys
 * @param {string[] | undefined} brands
 * @param {string[] | undefined} dateSolds
 * @param {number[] | undefined} reminderTextSents
 * @param {string[] | undefined} topImages
 * @param {string[] | undefined} bottomImages
 * @param {string[] | undefined} deleted
 * @param {number[] | undefined} ids
 * @param {number[] | undefined} dateOfReminderTexts
 * @returns {Promise<DbResponse>} inventory data or errors
 */
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
  topImages: string[] | undefined,
  bottomImages: string[] | undefined,
  deleted: number[] | undefined,
  ids: number[] | undefined,
  dateOfReminderTexts: string[] | undefined
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
          { topImage: { eq: topImages } },
          and,
          { bottomImage: { eq: bottomImages } },
          and,
          { deleted: { eq: deleted } },
          and,
          { id: { eq: ids } },
          and,
          {
            dateOfReminderText: { eq: dateOfReminderTexts },
          },
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

/**
 * perform insert on database to add to {@link INVENTORY_TABLE} table
 *
 * @param attributes
 * @returns
 */
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
  orgCode: string;
}): Promise<DbResponse> => {
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

/**
 * patch a record in {@link INVENTORY_TABLE}
 *
 * @param {number} id record id
 * @param {object} attributes object mapping database fields to values
 * @returns {Promise<DbResponse>}
 */
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
    dateTexted?: string;
  }
): Promise<DbResponse> => {
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

/**
 * get courses from {@link COURSES_TABLE} with params as filters
 *
 * @param {string[] | undefined} orgCode
 * @param {number[] | undefined} activeForLostAndFound
 * @param {string[] | undefined} courseName
 * @param {string[] | undefined} state
 * @param {string[] | undefined} city
 * @param {string[] | undefined} shortCode
 * @param {string[] | undefined} createdAt
 * @param {string[] | undefined} updatedAt
 * @param {string[] | undefined} shortLink
 * @param {string[] | undefined} link
 * @param {string[] | undefined} udiscLeagueURL
 * @returns
 */
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

/**
 * health checks connection to database with simple SELECT 1 query
 *
 * @returns {Promise<DbResponse>}
 */
export const healthCheck = async (): Promise<DbResponse> => {
  try {
    const pool = zzz.pool();
    if (!pool) {
      throw Error("pool not init");
    }
    const [result, _fields] = await pool.query("SELECT 1");
    if (!Array.isArray(result)) {
      throw Error(`unexpected result: ${JSON.stringify(result)}`);
    }
    return { data: result };
  } catch (e) {
    console.error(e, "health check error");
    return { errors: [] };
  }
};

/**
 * upserts phone opt in record in {@link PHONE_OPT_IN_TABLE}
 *
 * @param {{id: string, optIn: 0 | 1}} param0 object with id and optIn value
 * @returns
 */
const putPhoneOptIn = async ({
  id,
  optIn,
}: {
  id: string;
  optIn: 0 | 1;
}): Promise<DbResponse> => {
  try {
    const pool = zzz.pool();
    if (!pool) {
      throw Error("pool not init");
    }
    const [result, _fields] = await pool.query(
      `INSERT INTO ${PHONE_OPT_IN_TABLE} (id, sms_consent)` +
        ` VALUES ("${id}", ${optIn}) AS new_opt_in` +
        ` ON DUPLICATE KEY UPDATE sms_consent = new_opt_in.sms_consent;`
    );
    return { data: result };
  } catch (e) {
    console.error(e, "putPhoneOptIn error");
    return { errors: [] };
  }
};

/**
 * get list of phone opt ins from {@link PHONE_OPT_IN_TABLE}
 *
 * @param {string[] | undefined} phones e164 formatted phone numbers
 * @param {(0 | 1)[]} smsConsents 0 1 for smsConsent out or in
 * @returns {Promise<DbResponse>}
 */
const getPhoneOptIns = async (
  phones: string[] | undefined,
  smsConsents: (0 | 1)[] | undefined
): Promise<DbResponse> => {
  try {
    const results: ZzzResponse<QueryResult> = await zzz.q({
      select: {
        table: PHONE_OPT_IN_TABLE,
        where: [
          { id: { eq: phones } },
          and,
          { sms_consent: { eq: smsConsents } },
        ],
      },
    });
    if ("error" in results) {
      throw new Error(JSON.stringify(results.error));
    }
    return { data: results };
  } catch (e) {
    console.error(e, " error from database query (getPhoneOptIns");
    return { errors: [{ code: "", message: "" }] };
  }
};

/**
 * Insert a record into the sms_logs table
 *
 * @param {object} logEntry
 * @returns {Promise<DbResponse>}
 */
const insertSmsLog = async (logEntry: {
  discId: number;
  message: string;
  sentBy: string;
  recipientPhone: string;
  sentAt: string;
}): Promise<DbResponse> => {
  try {
    const results: ZzzResponse<QueryResult> = await zzz.q({
      insert: {
        table: "sms_logs", // Make sure this matches your actual table name
        values: {
          disc_id: logEntry.discId,
          message: logEntry.message,
          sent_by: logEntry.sentBy,
          recipient_phone: logEntry.recipientPhone,
          sent_at: logEntry.sentAt,
        },
      },
    });
    if ("error" in results) {
      throw new Error(JSON.stringify(results.error));
    }
    return { data: results };
  } catch (e) {
    console.error(e, " error from database query (insertSmsLog)");
    return { errors: [{ code: "", message: "" }] };
  }
};

export default {
  getBrands,
  getDiscs,
  getInventory,
  postInventory,
  patchInventory,
  getCourses,
  getPhoneOptIns,
  putPhoneOptIn,
  insertSmsLog,
};
