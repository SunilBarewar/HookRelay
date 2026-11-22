/** Every URL in the app, so links and redirects never hard-code a path. */
export const paths = {
  home: "/",
  login: "/login",
  signup: "/signup",
  applications: "/applications",
  /** Route pattern; build real links with `applicationPath(id)`. */
  application: "/applications/:applicationId",
} as const;

/** The page for one application and its endpoints. */
export const applicationPath = (applicationId: string) => `/applications/${applicationId}`;
