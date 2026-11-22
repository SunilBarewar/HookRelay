# HookRelay web app

The browser dashboard for HookRelay. It lets people sign up, log in and, as the screens are built,
manage their applications and endpoints and see how their webhooks were delivered.

Built with React 19, Vite, TypeScript, Tailwind CSS v4, React Router and TanStack Query.

## What's built

| Screen                                                                    | Status  |
| ------------------------------------------------------------------------- | ------- |
| Landing page (`/`)                                                        | Done    |
| Sign up (`/signup`) and log in (`/login`)                                 | Done    |
| List applications (`/applications`), with loading, empty and error states | Done    |
| Create, edit and delete applications                                      | Planned |
| List endpoints in an application                                          | Planned |
| Create, edit, enable or disable, delete endpoints                         | Planned |
| List the events sent to an endpoint                                       | Planned |

Creating events is not part of this app. Events are published through the API or the SDK.

Several planned screens need API routes that don't exist yet, such as listing applications. The API
client already includes `application.list()`, which will return 404 until that route is added.

## Running it

From the repo root:

```bash
pnpm dev:web       # http://localhost:5173
```

The API must be running too (`pnpm dev:api`), and its `WEB_ORIGIN` must match the address you open the
app on. The default, `http://localhost:5173`, matches the dev server.

Scripts, from `apps/web`:

| Script         | What it does                       |
| -------------- | ---------------------------------- |
| `pnpm dev`     | Start the dev server               |
| `pnpm build`   | Typecheck, then build to `dist/`   |
| `pnpm preview` | Serve the production build locally |

Linting and formatting run from the repo root (`pnpm lint`, `pnpm format`) using the root
`.oxlintrc.json`.

### Configuration

| Variable       | Default                 | Purpose                      |
| -------------- | ----------------------- | ---------------------------- |
| `VITE_API_URL` | `http://localhost:8000` | Address of the HookRelay API |

## How it works

### Authentication

The API stores the login token in an **httpOnly cookie**, so the app never sees or stores it. That has
a few consequences:

- Requests send the cookie because the axios client uses `withCredentials: true`.
- The app can't tell whether it's logged in by looking for a token. It asks the API with
  `apiClient.auth.me()`, and a `401` means logged out. `useSession()` wraps this in a query.
- Logging in or out only needs to refresh that session query. The route guards then redirect on their own.

In production the app and the API must be on the same site (for example `app.example.com` and
`api.example.com`), or the browser won't send the cookie.

### Routing

Everything routing-related is in `src/routes/`:

- `paths.ts` lists every URL. Use `paths.login`, not `"/login"`, in links and redirects.
- `AppRoutes.tsx` is the route table, grouped into public, logged-out-only and logged-in-only routes.
- `guards.tsx` has `GuestOnly` (redirects logged-in visitors to the app) and `RequireAuth` (redirects
  logged-out visitors to log in).

### API client

`src/lib/api` exposes one object, grouped by resource:

```ts
import { apiClient } from "./lib/api/index.ts";

await apiClient.auth.login({ email, password });
const me = await apiClient.auth.me();
const apps = await apiClient.application.list();
await apiClient.endpoint.create(appId, { url, eventTypes: ["order.created"] });
```

Every call throws an `ApiError` on failure, with `message`, `status`, `code` and `details` taken from the
API's error response. A missing `status` means the server couldn't be reached.

Use it through TanStack Query (`useQuery` for reads, `useMutation` for writes) so screens get loading
and error states for free. The query client is in `src/lib/query-client.ts`.

### Shared types

Request and response types are not written by hand. They come from the zod schemas the API itself uses,
in `@hookrelay/shared`, so a backend change shows up here as a type error. `src/lib/api/types.ts`
re-exports them, and forms can validate with the same schemas.

Always import from the subpath:

```ts
import { CredentialsBody } from "@hookrelay/shared/schemas"; // good
import { CredentialsBody } from "@hookrelay/shared"; // bad: pulls in Node-only code
```

## Code structure

```
src/
├── main.tsx             Mounts the app with the router and React Query
├── App.tsx              Renders the routes
├── index.css            Tailwind import, Inter font and brand colour tokens
├── routes/              Route table, guards and paths
├── features/
│   ├── applications/    Applications list page, its hooks and states
│   ├── auth/            Login, signup, session hooks and the shared credentials form
│   └── landing/         Landing page sections
├── components/
│   ├── layout/          AppLayout: header and frame for logged-in screens
│   └── ui/              Button, ButtonLink, TextField, EmptyState, Logo and Spinner
└── lib/
    ├── api/             apiClient: http.ts, resources.ts, types.ts
    ├── query-client.ts  React Query defaults
    └── cx.ts            Class name helper
```

Code is grouped by feature. Each folder under `features/` holds the pages, components and hooks for one
area. Anything used by more than one feature lives in `components/ui` or `lib`.

## Adding a screen

1. Create `src/features/<name>/` with the page and its components.
2. Add the URL to `src/routes/paths.ts`.
3. Add the route to `src/routes/AppRoutes.tsx`. Logged-in screens go inside `RequireAuth` and `AppLayout`.
4. Add any missing API call to `src/lib/api/resources.ts`.
5. Fetch with TanStack Query, and show loading, empty and error states.

## Design

- **Styling:** Tailwind utility classes. The single brand colour is defined as `brand-*` tokens in
  `index.css`, so it can be changed in one place.
- **Components:** small and focused. Use `Button` for actions and `ButtonLink` for navigation.
- **Forms:** persistent labels, errors shown next to their fields, input kept after a failed submit, and
  a disabled button with a progress label while a request is running.
- **Accessibility:** semantic HTML, visible focus, 44px touch targets, and reduced-motion support.
