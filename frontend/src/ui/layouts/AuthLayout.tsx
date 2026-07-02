import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div className="flex items-center justify-center min-h-screen bg-neutral-50">
    <Outlet />
  </div>
);
