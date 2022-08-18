import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  return loggedIn ? <Outlet /> : <Navigate to="login" replace />;
}
