import {
  Route,
  BrowserRouter as Router,
  Routes,
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
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MovieDescription2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/theater/:id"
            element={
              <ProtectedRoute>
                <TheaterDescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/selectSeats/:param"
            element={
              <ProtectedRoute>
                <SelectSeats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
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

// function Root() {
//   //check if token exist, the user is authenticated
//   // const isAuthenticated = !!localStorage.getItem("token");

//   return <p>root</p>
// }
export default App;
