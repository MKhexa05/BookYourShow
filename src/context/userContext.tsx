import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";

type UserContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthenticated: () => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext must be used inside UserProvider");
  }
  return ctx;
};

type UserProviderProps = {
  children: ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Called after successful login
   */
  const setAuthenticated = () => {
    setIsAuthenticated(true);
  };

  /**
   * Local logout (axios interceptor handles redirects)
   */
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  /**
   * Initial auth check on app load
   */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // This should return 200 if token is valid
        await axiosInstance.get(API_PATH.APP.GET);
        setIsAuthenticated(true);
      } catch {
        // 401 will be handled by axios interceptor
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        setAuthenticated,
        logout,
      }}
    >
      <div className="bg-linear-to-bl from-blue-200 via-white to-blue-200 m-0 p-0">
        {children}
      </div>
    </UserContext.Provider>
  );
};

export default UserProvider;
