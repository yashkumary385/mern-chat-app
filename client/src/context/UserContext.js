// src/context/UserContext.js
import { createContext } from "react";

const UserContext = createContext(null);
export const getToken = () => {
  return localStorage.getItem("token");
};
export default UserContext;
