type InventoryQuery = {
  course: string;
};

export const isInventoryQuery = (query: unknown): query is InventoryQuery => {
  if (typeof query !== "object" || query === null) {
    console.error(query, `query is not an object or is null`);
    return false;
  }

  if (
    !("course" in query) ||
    typeof query.course !== "string" ||
    !query.course
  ) {
    console.error(query, `query has invalid "course" value`);
    return false;
  }

  return true;
};
