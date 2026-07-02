// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/ui//layouts/AppLayout";
import { AuthLayout } from "@/ui/layouts/AuthLayout";
import { Login } from "../features/genres/pages/Login";
import { Genre } from "../features/genres/pages/genre/Genre";

export const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
    </Route>

    <Route element={<AppLayout />}>
      <Route path="/" element={<div>Movie App</div>} />
      {/* <Route path="/movies" element={<MoviesList />} /> */}
      <Route path="/genres" element={<Genre />} />
    </Route>
  </Routes>
);
