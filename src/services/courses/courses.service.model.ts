export const COURSE_TYPE = "course";

export type GetCoursesQuery = {
  orgCode?: string[];
  activeForLostAndFound?: number[];
};
