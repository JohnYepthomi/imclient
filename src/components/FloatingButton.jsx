import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setRequestSubmitted } from "../slices/groupSetupSlice";
import { motion, useAnimationControls } from "framer-motion/dist/framer-motion";

export default function FloatingButton() {
  const animControl = useAnimationControls();
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.floatingButton.currentPage);

  const navigate = useNavigate();

  let pageVariants = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    in: {
      opacity: 1,
      scale: 1,
    },
    out: {
      opacity: 0,
      scale: 0,
    },
  };

  let pageTransition = {
    type: "linear",
    ease: "easeInOut",
    duration: 0.2,
  };

  function MessageButton() {
    useEffect(() => {
      const runAnim = async () => {
        await animControl.set("initial");
        await animControl.start("in", pageTransition);
      };

      runAnim();
    }, []);

    return (
      <div className="new-message-button">
        <Link to="/contacts">
          <motion.svg
            variants={pageVariants}
            animate={animControl}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-chat-square-text-fill"
            viewBox="0 0 16 16"
          >
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
          </motion.svg>
        </Link>
      </div>
    );
  }

  function StatusButton() {
    useEffect(() => {
      const runAnim = async () => {
        await animControl.set("initial");
        await animControl.start("in", pageTransition);
      };

      runAnim();
    }, []);

    return (
      <div className="new-message-button">
        <Link to="/contacts">
          <motion.svg
            variants={pageVariants}
            animate={animControl}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-pencil-square"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
            />
          </motion.svg>
        </Link>
      </div>
    );
  }

  function ContactsButton() {
    useEffect(() => {
      const runAnim = async () => {
        await animControl.set("initial");
        await animControl.start("in", pageTransition);
      };

      runAnim();
    }, []);

    return (
      <div className="new-message-button">
        <Link to="/contacts">
          <motion.svg
            variants={pageVariants}
            animate={animControl}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-person-plus-fill"
            viewBox="0 0 16 16"
          >
            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path
              fillRule="evenodd"
              d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
            />
          </motion.svg>
        </Link>
      </div>
    );
  }

  function handleNavToGroupSetup() {
    navigate("/groupsetup");
  }

  function handleNavToHome() {
    navigate("/");
  }

  function ContactSelectionButton() {
    const contactSelected = useSelector(
      (state) => state.groupSetup.contactSelected
    );

    useEffect(() => {
      const runAnim = async () => {
        await animControl.set({ opacity: 1, translateX: "-20px" });
        await animControl.start({ opacity: 1, translateX: 0 }, pageTransition);
      };

      runAnim();
    }, []);

    if (!contactSelected) {
      return <></>;
    } else
      return (
        <div className="new-message-button" onClick={handleNavToGroupSetup}>
          <motion.svg
            variants={pageVariants}
            animate={animControl}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
            />
          </motion.svg>
        </div>
      );
  }

  function GroupSetupButton() {
    useEffect(() => {
      const runAnim = async () => {
        await animControl.set("initial");
        await animControl.start("in", pageTransition);
      };

      runAnim();
    }, []);

    return (
      <div
        className="new-message-button"
        onClick={() => {
          dispatch(setRequestSubmitted(true));
        }}
      >
        <motion.svg
          variants={pageVariants}
          animate={animControl}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          class="bi bi-check-lg"
          viewBox="0 0 16 16"
        >
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
        </motion.svg>
      </div>
    );
  }

  if (currentPage == "chats") return <MessageButton />;
  else if (currentPage === "status") return <StatusButton />;
  else if (currentPage === "contacts") return <ContactsButton />;
  else if (currentPage === "select_contacts") return <ContactSelectionButton />;
  else if (currentPage === "groupsetup") return <GroupSetupButton />;
}
