import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components";
import "../styles/home.css";

export default function Home() {
  return (
    <div>
      <div className="queue-logger">Queue logger</div>
      <div className="client-logger">Client logger</div>
      <Header />
      <Outlet />
    </div>
  );
}
