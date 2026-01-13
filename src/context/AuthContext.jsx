import {  createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { useHttp } from "../hook/useHttp";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { sendRequest, isLoading, error } = useHttp();
 const [user, setUser] = useState(null);
const [isCheckingUser, setIsCheckingUser] = useState(true);
 
useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsCheckingUser(false);
  }, []);


  const login = async (username, password) => {
    const users = await sendRequest(() =>
      apiRequest(`/users?username=${username}`)
    );

    const user = users.find(u => u.website === password);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    setUser({ ...user, idStr: String(user.id) }); 

    return user;
  };

  const register = async (userData) => {
    const newUser = await sendRequest(() =>
      apiRequest("/users", {
        method: "POST",
        body: userData
      })
    );

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser({ ...newUser, idStr: String(newUser.id) });
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isLoading, error,isCheckingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);