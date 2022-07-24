import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components";

export default function Home() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
