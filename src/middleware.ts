import { AUTH_ISSUER } from "./env";

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
    if (allowClientCredentialsGrantType(req)) {
      next();
      return;
    }
    const userOrgCode = handleOrgCode(req, res);
    if (userOrgCode === null) {
      return;
    }
    const recordOrgCode = await getOrgCode(req, res);
    if (userOrgCode === recordOrgCode) {
      next();
    } else {
      res.status(403).send({
        errors: [{ code: "403", message: "unauthorized" }],
      });
    }
  };
};

const allowClientCredentialsGrantType = (req): boolean => {
  const grantType = req.auth?.payload?.gty ?? null;
  if (!Array.isArray(grantType) || !grantType.includes("client_credentials")) {
    return false;
  }
  const issuer = req.auth?.payload?.iss ?? null;
  if (issuer !== AUTH_ISSUER) {
    return false;
  }
  return true;
};
