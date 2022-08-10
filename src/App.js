import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import { AnimatePresence } from "framer-motion/dist/framer-motion";

export default function App() {
  let pageSlideVariants = {
    initial: {
      x: "-100vw",
      // scale: 0.5,
      opacity: 0,
    },
    in: {
      x: 0,
      // scale: 1,
      opacity: 1,
    },
    out: {
      x: "100vw",
      // scale: 1.2,
      opacity: 0,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  };

  const pageStyle = {
    position: "absolute",
    height: "calc(100vh - 80px)",
    width: "100%",
    zIndex: 0,
    marginTop: "80px",
  };

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
    <div style={{ overflowX: "hidden", position: "relative", height: "100vh" }}>
      <Provider store={store}>
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path="/" element={<Home />}>
                <Route
                  index={true}
                  element={
                    <MessagesList
                      pageVariants={pageSlideVariants}
                      pageTransition={pageTransition}
                      pageStyle={pageStyle}
                    />
                  }
                />
                <Route
                  path="status"
                  element={
                    <Status
                      pageVariants={pageSlideVariants}
                      pageTransition={pageTransition}
                      pageStyle={pageStyle}
                    />
                  }
                />
                <Route
                  path="contacts"
                  element={
                    <Contacts
                      pageVariants={pageSlideVariants}
                      pageTransition={pageTransition}
                      pageStyle={pageStyle}
                    />
                  }
                />
                <Route
                  path="groupsetup"
                  element={
                    <NewGroupMessageSetup
                      pageVariants={pageSlideVariants}
                      pageTransition={pageTransition}
                      pageStyle={pageStyle}
                    />
                  }
                ></Route>
                <Route
                  path="conversation/:senderjid"
                  element={
                    <Conversation
                      pageVariants={pageSlideVariants}
                      pageTransition={pageTransition}
                      pageStyle={pageStyle}
                    />
                  }
                />
              </Route>
            </Route>
            <Route path="login" element={<Login />} />
          </Routes>
        </AnimatePresence>
      </Provider>
    </div>
  );
}
