
import React, { createContext, useContext, useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (accounts.length > 0) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          fetch(
            `https://localhost:45455/api/User/getUserRoleByEmail/${encodeURIComponent(
              response.account.username
            )}`
          )
            .then((res) => res.json())
            .then((user) => {
              console.log("useruser",user)
              const currentUser = {
                username: user.displayName,
                mail: user.mail,
                name: user.displayName,
                role: user.role,
              };
              setUser(currentUser);
              localStorage.setItem("currentUser", JSON.stringify(currentUser));
            })
            .catch((error) => {
              console.error("Failed to fetch user details:", error);
              setUser(null);
              localStorage.removeItem("currentUser");
            });
        })
        .catch((err) => {
          console.error("Failed to acquire token:", err);
        });
    }
  }, [accounts, instance]);

  const login = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem("currentUser", JSON.stringify(userInfo));
  };

  const logout = () => {
    instance.logoutPopup().then(() => {
      setUser(null);
      localStorage.removeItem("currentUser");
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
