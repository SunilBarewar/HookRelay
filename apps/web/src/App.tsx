import { Route, Routes } from "react-router";

import { GuestOnly, RequireAuth } from "./features/auth/guards.tsx";
import { LoginPage } from "./features/auth/LoginPage.tsx";
import { SignupPage } from "./features/auth/SignupPage.tsx";
import { LandingPage } from "./features/landing/LandingPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/applications" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
