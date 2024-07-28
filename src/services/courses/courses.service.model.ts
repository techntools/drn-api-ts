export const COURSE_TYPE = "course";

export type GetCoursesQuery = {
  orgCode?: string[];
  activeForLostAndFound?: number[];
  courseName?: string[];
  state?: string[];
  city?: string[];
  shortCode?: string[];
  createdAt?: string[];
  updatedAt?: string[];
  shortLink?: string[];
  link?: string[];
  udiscLeagueURL?: string[];
};
