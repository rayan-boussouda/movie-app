import { getCurrentUser } from "@/use-case/auth/auth";
import { Header, UserMenu } from "@rayan.boussouda/ui-kit";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const links = [
    { label: "Home", href: "/", active: location.pathname === "/" },
    {
      label: "Movies",
      href: "/movies",
      active: location.pathname === "/movies",
    },
    {
      label: "Genres",
      href: "/genres",
      active: location.pathname === "/genres",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Header
        logo={<span className="font-bold text-neutral-900">🎬 MovieApp</span>}
        links={links}
        rightSlot={
          <UserMenu
            src={"https://api.dicebear.com/7.x/avataaars/svg?seed=rayan"}
            name={user?.name}
            alt={user?.name}
            items={[
              { label: "Profile", href: "/profile" },
              { label: "Settings", href: "/settings" },
              { label: "Log out", onClick: handleLogout, separator: true },
            ]}
          />
        }
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </>
  );
};
