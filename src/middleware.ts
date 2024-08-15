export const handleOrgCode = (req, res): string | null => {
  const userOrgCodeRaw = req.auth?.payload?.org_code;
  if (typeof userOrgCodeRaw !== "string" || !userOrgCodeRaw) {
    res.status(400).send({
      errors: [{ code: "no_org_code", message: "no org in auth" }],
    });
    return null;
  }
  const userOrgCode = userOrgCodeRaw.trim();
  if (!userOrgCode) {
    res.status(400).send({
      errors: [{ code: "no_org_code", message: "no org in auth" }],
    });
    return null;
  }
  return userOrgCode;
};

export const requireOrgAuth = (
  getOrgCode: (request, response) => Promise<string | null>
) => {
  return async (req, res, next) => {
    const userOrgCode = handleOrgCode(req, res);
    if (userOrgCode === null) {
      return;
    }
    const recordOrgCode = await getOrgCode(req, req);
    if (userOrgCode === recordOrgCode) {
      next();
    } else {
      res.status(403).send({
        errors: [{ code: "403", message: "unauthorized" }],
      });
    }
  };
};
