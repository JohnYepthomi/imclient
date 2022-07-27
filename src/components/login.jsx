import React, { useMountEffect } from "react";
import "../styles/login.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  authenticateUser,
  saveCredential,
  logout,
} from "../features/authSlice";
import LoadingSpiner from "./LoadingSpiner";

export default function Login() {
  const [submitted, setSubmitted] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeClient = useSelector((state) => state.auth.activeClient);
  const loggedOut = useSelector((state) => state.auth.loggedOut);
  const credential = useSelector((state) => state.auth.credential);

  const authProcess = () => {
    if (!loggedOut && !activeClient) {
      console.log("loggin in using saved credtials...");
      dispatch(
        authenticateUser({
          username: credential[0].username,
          password: credential[0].password,
        })
      );
      setSubmitted(true);
    }
  };

  const handleSubmit = () => {
    let username = usernameRef.current.value;
    let password = passwordRef.current.value;

    dispatch(authenticateUser({ username, password }));
    dispatch(saveCredential({ username, password }));
    dispatch(logout(false));
    setSubmitted(true);
  };

  useEffect(() => {
    if (activeClient) navigate("/");
  }, [activeClient]);

  useEffect(() => {
    authProcess();
  }, []);

  return (
    <div className="login-container">
      <div className="login-body">
        <div className="login-branding">
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
            Asend<sup style={{ fontSize: "0.5rem", color: "white" }}>TM</sup>
          </div>
        </div>
        <div className="login-form">
          <div className="login-form-input">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Rippl ID"
              ref={usernameRef}
            />
          </div>
          <div className="login-form-input">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              ref={passwordRef}
            />
          </div>
          <div className="login-form-input">
            <button id="login-button" onClick={handleSubmit}>
              Login
            </button>
          </div>
        </div>

        <LoadingSpiner submitted={submitted} />
      </div>
    </div>
  );
}
