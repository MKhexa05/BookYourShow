import { createContext, useState } from "react";

type UserContextType = {
  user: boolean;
  updateUser: (user: boolean) => void;
  clearUser: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState(false);

  const updateUser = (user: boolean) => {
    setUser(user);
  };

  const clearUser = () => {
    setUser(false);
  };

  return (
    <UserContext.Provider
    
      value={{
        user,
        updateUser,
        clearUser,
      }}
    >
      <div className="bg-linear-to-bl from-blue-200 via-white to-blue-200">


      {children }
    </div>
    </UserContext.Provider>
  );
};

export default UserProvider;
