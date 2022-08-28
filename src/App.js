import Home from "./container/home";
import React from "react";
import store from "./store/store";
import ClientService from "./services/connection.service";
import GroupSetup from "./Pages/Group Setup/GroupSetup";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { PrivateRoute } from "./auth/PrivateRouter";
import { Routes, Route, useLocation } from "react-router-dom";
import { Login, Messages, Contacts, Status } from "./Pages";
import MessagesList from "./Pages/MessagesList/MessagesList";

export default function App() {
  /* release resource*/
  const handleTabClose = async (event) => {
    event.preventDefault();
    await ClientService.gracefulExit();
    return true;
  };

  const location = useLocation();

  useEffect(() => {
    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return (
    <Provider store={store}>
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<PrivateRoute />}>
          <Route exact path="/" element={<Home />}>
            <Route index={true} element={<MessagesList />} />
            <Route path="status" element={<Status />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="select_contacts" element={<Contacts />} />
            <Route path="groupsetup" element={<GroupSetup />}></Route>
            <Route path="conversation" element={<Messages />} />
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </Provider>
  );
}
