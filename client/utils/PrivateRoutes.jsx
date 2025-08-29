import React from "react";
import { useUser } from "../src/hooks/useUser";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoutes;
