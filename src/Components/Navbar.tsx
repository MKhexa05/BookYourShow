import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/cinema-logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
    }

    const location = useLocation();

const isHomeActive =
  matchPath("/dashboard", location.pathname) ||
  matchPath("/movie/:id", location.pathname) ||
  matchPath("/theater/:id", location.pathname);

  return (
    <nav className="w-full">
      <div className="flex items-center justify-between">
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <img
            src={logo} // <-- update path
            alt="Cinemas Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* CENTER: Navigation */}
        <div className="flex items-center gap-10">
          <NavLink
            to="/dashboard"
            className={() =>
              `relative pb-1 text-sm font-medium transition ${
                isHomeActive
                  ? "text-[#1090DF] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[#1090DF]"
                  : "text-[#1090DF] hover:border-b-[#1090DF]"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              `relative pb-1 text-sm font-medium transition ${
                isActive
                  ? "text-[#1090DF] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[#1090DF]"
                  : "text-[#1090DF] hover:border-b-[#1090DF]"
              }`
            }
          >
            My Ticket
          </NavLink>
        </div>

        {/* RIGHT: Logout */}
        <div>
          <button
            className="rounded-md bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 transition 
          hover:cursor-pointer hover:scale-[107%]  "
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
