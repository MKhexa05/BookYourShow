import { useUserContext } from "../context/userContext";

const useUserAuth = () => {
  return useUserContext();
};

export default useUserAuth;
