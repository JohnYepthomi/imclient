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
        <div>
          Rippl<sup style={{ fontSize: "0.5rem", color: "black" }}>TM</sup>
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
