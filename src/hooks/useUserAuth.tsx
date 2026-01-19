import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) return;

    let isMounted = true;
    const fetchToken = () => {
      const token = localStorage.getItem("token");
      if (isMounted && token) {
        updateUser(true);
        if(matchPath("/auth", location.pathname)){

          navigate("/");
        }
      } else if (isMounted) {
        clearUser();
        navigate("/auth");
      }
    };
    fetchToken();

    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, navigate, user]);
};

export default useUserAuth;
