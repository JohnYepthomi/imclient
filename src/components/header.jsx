import React from "react";
import "../styles/header.css";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [activeTab, setActiveTab] = useState("Messages");

  const handelTabClick = (e) => {
    if (e.target.innerText === "CHATS") setActiveTab("Messages");
    if (e.target.innerText === "STATUS") setActiveTab("Status");
    if (e.target.innerText === "CONTACTS") setActiveTab("Contacts");
  };

  useEffect(() => {
    //
  }, []);

  return (
    <div className="main-header">
      <div className="branding">
        <div className="brand-name">
          Rippl<sup style={{ fontSize: "0.5rem", color: "wheat" }}>TM</sup>
        </div>
      </div>
      <div className="menu">
        <div
          className="menu-item"
          draggable={false}
          active={activeTab === "Messages" ? "true" : "false"}
          onClick={handelTabClick}
        >
          <Link to="/">
            <div>CHATS</div>
          </Link>
        </div>

        <div
          className="menu-item"
          active={activeTab === "Status" ? "true" : "false"}
          onClick={handelTabClick}
        >
          <Link to="/status">
            <div>STATUS</div>
          </Link>
        </div>

        <div
          className="menu-item"
          active={activeTab === "Contacts" ? "true" : "false"}
          onClick={handelTabClick}
        >
          <Link to="/contacts">
            <div>CONTACTS</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
