import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
  const activeClient = useSelector((state) => state.auth.activeClient);

  return activeClient ? <Outlet /> : <Navigate to="login" replace />;
}
