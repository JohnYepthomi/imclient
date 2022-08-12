import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components";
import FloatingButton from "../components/floatingButton";
import "../styles/home.css";

export default function Home() {
  return (
    <div>
      <Header />
      <FloatingButton />
      <Outlet />
    </div>
  );
}
