import React from "react";
import "../styles/login.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { saveUserInfo, updateUserLogin } from "../features/authSlice";
import LoadingSpiner from "./LoadingSpiner";
import diSetup from "../DI/di-setup";

export default function Login() {
  const [submitted, setSubmitted] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const loggedOut = useSelector((state) => state.auth.loggedOut);
  const savedUserInfo = useSelector((state) => state.auth.userInfo);

  const handleSubmit = async () => {
    let userInfo = {
      credential: {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      },
      domain: "localhost",
      service: "ws://ejimserver.herokuapp.com/",
      resource: "mobile",
    };

    if (loggedOut) {
      setSubmitted(true);
      dispatch(saveUserInfo(userInfo));
      await diSetup(userInfo);
      dispatch(updateUserLogin(true));
    }
  };

  useEffect(() => {
    async function diCall(userInfo) {
      await diSetup(userInfo);
    }

    if (!loggedOut) {
      dispatch(updateUserLogin(true));
      diCall(savedUserInfo);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) navigate("/");
  }, [loggedIn]);

  return (
    <div className="login-container">
      <div className="login-body">
        <div className="login-branding">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-chat-left-quote-fill"
            viewBox="0 0 16 16"
          >
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm7.194 2.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 4C4.776 4 4 4.746 4 5.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.461 2.461 0 0 0-.227-.4zM11 7.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.466 2.466 0 0 0-.228-.4 1.686 1.686 0 0 0-.227-.273 1.466 1.466 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 10.07 4c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z" />
          </svg>
          <div>
            Asend<sup style={{ fontSize: "0.6rem", color: "white" }}>TM</sup>
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
