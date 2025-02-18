import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/sign-up.tsx";
import { SignUpProfile } from "./pages/sign-up-profile.tsx";
import MathcingBoard from "./pages/matching-board.tsx";
import Login from "./pages/login.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signup/profile" element={<SignUpProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<MathcingBoard />} />
    </Routes>
    <Toaster />
  </BrowserRouter>
);
