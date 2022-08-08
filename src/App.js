import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Login,
  Conversation,
  MessagesList,
  Contacts,
  Status,
} from "./components";
import Home from "./container/home";
import store from "./store/store";
import { Provider } from "react-redux";
import { PrivateRoute } from "./auth/PrivateRouter";
import ClientService from "./services/connection.service";
import NewGroupMessageSetup from "./components/NewGroupMessageSetup";

export default function App() {
  /* release resource*/
  const handleTabClose = async (event) => {
    event.preventDefault();
    await ClientService.gracefulExit();
    return true;
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return (
    <Provider store={store}>
      <Routes>
        <Route exact path="/" element={<PrivateRoute />}>
          <Route exact path="/" element={<Home />}>
            <Route index={true} element={<MessagesList />} />
            <Route path="status" element={<Status />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="groupsetup" element={<NewGroupMessageSetup />}></Route>
            <Route path="conversation/:senderjid" element={<Conversation />} />
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </Provider>
  );
}
