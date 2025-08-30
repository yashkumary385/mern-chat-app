// src/context/UserContext.jsx
import {  useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { loginApi, meApi } from "../api/api.js";

import UserContext from "./UserContext";
// export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
   const [loading, setLoading] = useState(true);
  const login = async (email, password) => {
    try {
      const res = await loginApi(email, password);
      const { token, user } = res.data;
      console.log(res);
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      console.log(user);
        // setLoading(false);

      toast.success("Login Sucessfull")
      return {success : true}
    } catch (error) {
      console.log(error);
      if (error.response?.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response?.data);
        }
         return {
                success: false,
                error: error.res?.data?.message || "Login failed",
            };
    }finally{
        setLoading(false);
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
        const res = await meApi()
        setUser(res.data);
        // setLoading(false);
      } catch (error) {
        console.log(error);
        // logout();
      }finally{
        setLoading(false);
      }
    };

    getUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, login, logout ,setUser,loading}}>
      {children}
    </UserContext.Provider>
  );
};
