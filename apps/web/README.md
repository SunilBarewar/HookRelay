# HookRelay web app

This is the website for HookRelay. It's where people sign up, set up where their webhooks should be
sent, and check that every webhook arrived.

It's built with React, Vite, TypeScript and Tailwind CSS.

## What you can do in the app

- **Learn about HookRelay** on the landing page.
- **Create an account and log in.**
- **Manage applications.** An application is one product or environment, like "Billing service" or
  "Checkout (staging)". You can create, rename and delete them, and copy an application's ID.
- **Manage endpoints.** An endpoint is a web address that receives webhooks. You can add one, change
  its address or the events it receives, pause it, or delete it. When you add an endpoint you're shown
  its signing secret once, so copy it then.
- **See what was sent to an endpoint.** Every event is listed with whether it was delivered, is
  being retried, or failed. Open one to see the data that was sent and how the receiving server
  replied. The list updates by itself while deliveries are still in progress.

Sending events isn't done here. Events are sent through the HookRelay API or SDK.

## Running it

From the root of the repo:

```bash
pnpm dev:web
```

Then open http://localhost:5173. The API needs to be running as well (`pnpm dev:api`).

If your API isn't at `http://localhost:8000`, set `VITE_API_URL` to its address.

## Code structure

```
src/
├── routes/       Which page shows at which address, and who is allowed to see it
├── features/     One folder for each part of the app
│   ├── landing/        The landing page
│   ├── auth/           Sign up and log in
│   ├── applications/   The list of applications
│   ├── endpoints/      An application's endpoints
│   └── deliveries/     The events sent to an endpoint
├── components/   Pieces used on many pages, like the page header and buttons
├── lib/          Helpers, like talking to the API
└── index.css     The theme: colours and font
```

Each folder under `features/` holds everything for that part of the app: its pages, its pop-up
windows and how it gets its data. Anything shared by more than one part goes in `components/` or `lib/`.

## Design

The look is kept simple and consistent across every page.

- **Colour:** one brand colour (indigo) for the main buttons and links, with greys for everything
  else. It's set once in `src/index.css`, so changing it there changes it everywhere.
- **Status colours:** green means good (active, delivered), amber means waiting or retrying, and red
  means failed or dangerous, like the delete buttons.
- **Font:** Inter.
- **Layout:** a plain white and light grey page with rounded boxes. It works on phones as well as
  large screens.
- **Forms and pop-up windows:** every field has a visible label, errors appear next to the field in
  plain words, and what you typed is kept if something goes wrong.
- **Accessibility:** the whole app works with a keyboard, buttons are big enough to tap, focus is
  always visible, and animations are switched off for people who ask their device for less motion.

## Good to know

- **Login is kept in a cookie the page can't read.** This keeps it safer, but in production the app and
  the API need to be on the same website, such as `app.example.com` and `api.example.com`.
- **An endpoint's signing secret is shown only once,** when you create it. If it's lost, delete the
  endpoint and create a new one.
- **The events list shows the latest attempt for each event,** not every attempt along the way.
