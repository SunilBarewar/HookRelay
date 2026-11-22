/** Every URL in the app, so links and redirects never hard-code a path. */
export const paths = {
  home: "/",
  login: "/login",
  signup: "/signup",
  applications: "/applications",
  /** Route pattern; build real links with `applicationPath(id)`. */
  application: "/applications/:applicationId",
  /** Route pattern; build real links with `endpointPath(applicationId, endpointId)`. */
  endpoint: "/applications/:applicationId/endpoints/:endpointId",
} as const;

/** The page for one application and its endpoints. */
export const applicationPath = (applicationId: string) => `/applications/${applicationId}`;

/** The page for one endpoint and the events delivered to it. */
export const endpointPath = (applicationId: string, endpointId: string) =>
  `/applications/${applicationId}/endpoints/${endpointId}`;
