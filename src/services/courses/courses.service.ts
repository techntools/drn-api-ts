import { Request, Response } from "express";
import db from "../../db/db";
import { GetCoursesQuery } from "./courses.service.model";

export const getCourses = async (req: Request, res: Response) => {
  const query = req.query as GetCoursesQuery;
  const dbResponse = await db.getCourses(
    query.orgCode,
    query.activeForLostAndFound,
    query.courseName,
    query.state,
    query.city,
    query.shortCode,
    query.createdAt,
    query.updatedAt,
    query.shortLink,
    query.link,
    query.udiscLeagueURL
  );
  if ("errors" in dbResponse) {
    console.error(dbResponse, "errors in dbResponse (getCourses)");
    res.status(500).send(dbResponse);
    return;
  }
  const { data } = dbResponse;
  if (!Array.isArray(data)) {
    console.error(dbResponse, "dbResponse is not an array (getCourses)");
    res.status(500).send(dbResponse);
    return;
  }
  res.send({
    data: data.map((d) => {
      const attributes = {} as typeof d;
      Object.entries(d).forEach(
        ([key, value]) =>
          (attributes[key] =
            value instanceof Date ? value.toISOString() : value)
      );
      return {
        id: -1,
        type: "course",
        attributes,
      };
    }),
  });
};
