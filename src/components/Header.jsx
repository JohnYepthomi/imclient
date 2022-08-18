import Menu from "./Menu";
import React from "react";
import { setCurrentPage } from "../slices/floatingButtonSlice";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/header.css";

export default function Header() {
  const [showMore, setShowMore] = useState(false);
  const currentPage = useSelector((state) => state.floatingButton.currentPage);
  const dispatch = useDispatch();
  const location = useLocation();

  const handelTabClick = (viewName) => {
    dispatch(setCurrentPage(viewName));
  };

  function handleMoreClick(e) {
    e.stopPropagation();
    setShowMore(true);
  }

  function handleContainerClick(e) {
    e.stopPropagation();
    setShowMore(false);
  }

  useEffect(() => {
    let path = location.pathname;
    let pageName =
      path === "/" ? "chats" : location.pathname.replace(/[^\w\s]/gi, "");
    dispatch(setCurrentPage(pageName));
  }, [location]);

  let options = ["new group", "logout"];

  return (
    <div className="main-header" onClick={handleContainerClick}>
      <div className="branding">
        <div className="brand-name">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            fill="currentColor"
            class="bi bi-chat-left-quote-fill"
            viewBox="0 0 16 16"
          >
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm7.194 2.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 4C4.776 4 4 4.746 4 5.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.461 2.461 0 0 0-.227-.4zM11 7.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.466 2.466 0 0 0-.228-.4 1.686 1.686 0 0 0-.227-.273 1.466 1.466 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 10.07 4c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z" />
          </svg>
          <div>
            Asend<sup style={{ fontSize: "0.5rem", color: "wheat" }}>TM</sup>
          </div>
        </div>

        <div className="more-svg-button" onClick={handleMoreClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            class="bi bi-three-dots-vertical"
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </div>
      </div>

      <div className="menu">
        <div
          className="menu-item"
          active={currentPage === "chats" ? "true" : "false"}
          onClick={() => handelTabClick("chats")}
        >
          <Link to="/">
            <div>CHATS</div>
          </Link>
        </div>

        <div
          className="menu-item"
          active={currentPage === "status" ? "true" : "false"}
          onClick={() => handelTabClick("status")}
        >
          <Link to="/status">
            <div>STATUS</div>
          </Link>
        </div>

        <div
          className="menu-item"
          active={currentPage === "contacts" ? "true" : "false"}
          onClick={() => handelTabClick("contacts")}
        >
          <Link to="/contacts">
            <div>CONTACTS</div>
          </Link>
        </div>
      </div>

      {showMore && <Menu className="more-button" options={options} />}
    </div>
  );
}
