// src/context/UserContext.jsx
import {  useEffect, useState } from "react";
import axios from "axios";

import UserContext from "./UserContext";
// export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, user } = res.data;
      console.log(res);
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      console.log(user);
      return {success : true}
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    
  };

  useEffect(() => {
    const getUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
        setUser(res.data);
      } catch (error) {
        console.log(error);
        logout();
      }
    };

    getUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, login, logout ,setUser}}>
      {children}
    </UserContext.Provider>
  );
};
