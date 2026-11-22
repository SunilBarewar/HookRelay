import { Route, Routes } from "react-router";

import { AppLayout } from "../components/layout/AppLayout.tsx";
import { ApplicationsPage } from "../features/applications/ApplicationsPage.tsx";
import { DeliveriesPage } from "../features/deliveries/DeliveriesPage.tsx";
import { EndpointsPage } from "../features/endpoints/EndpointsPage.tsx";
import { LoginPage } from "../features/auth/LoginPage.tsx";
import { SignupPage } from "../features/auth/SignupPage.tsx";
import { LandingPage } from "../features/landing/LandingPage.tsx";
import { GuestOnly, RequireAuth } from "./guards.tsx";
import { paths } from "./paths.ts";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public to everyone. */}
      <Route path={paths.home} element={<LandingPage />} />

      {/* Only for logged-out visitors. */}
      <Route element={<GuestOnly />}>
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.signup} element={<SignupPage />} />
      </Route>

      {/* Only for logged-in users, inside the app frame. */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path={paths.applications} element={<ApplicationsPage />} />
          <Route path={paths.application} element={<EndpointsPage />} />
          <Route path={paths.endpoint} element={<DeliveriesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
