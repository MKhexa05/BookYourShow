import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import Dashboard from "./Components/Dashboard";
import TheaterDescription from "./Components/Theater/TheaterDescription";
import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";
import SelectSeats from "./Components/SelectSeats";
import Tickets from "./Components/Tickets";
import OrderSuccess from "./Components/OrderSuccess";
import MovieDescription2 from "./Components/Movie/MovieDescription2";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/movie/:id" element={<MovieDescription2 />} />
          <Route path="/theater/:id" element={<TheaterDescription />} />
          <Route path="/selectSeats/:param" element={<SelectSeats />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
}

function Cancel() {
  const navigate = useNavigate();

  setTimeout(() => navigate("/"), 2000);
  navigate("/");
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F7FBFF] to-[#E1F3FF]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />

        {/* Text */}
        <p className="text-lg font-semibold text-gray-800">
          Redirecting to homepage
        </p>

        <p className="text-sm text-gray-500">Please wait a moment…</p>
      </div>
    </div>
  );
}

function Root() {
  //check if token exist, the user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/auth" />
  );
}
export default App;
