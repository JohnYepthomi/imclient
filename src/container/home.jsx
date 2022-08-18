import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components";
import FloatingButton from "../components/FloatingButton";
import "../styles/home.css";

export default function Home() {
  return (
    <div>
      <Header />
      <Outlet />
      <FloatingButton />
    </div>
  );
}
