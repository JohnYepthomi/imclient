import React from "react";
import "../styles/NewGroupMessageSetup.css";
import { motion } from "framer-motion/dist/framer-motion";

export default function NewGroupMessageSetup() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      // variants={pageVariants}
      // transition={pageTransition}
      // style={pageStyle}
    >
      <div className="group-setup-container">
        <div className="new-group-name">
          <label>Group Name</label>
          <input type="text" className="name" placeholder="" />
        </div>

        <div className="group-participants">
          <div className="header">Paticipants</div>
          <div className="participant-details">
            <div className="profile-image">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="blue"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </div>
            <div>Samuel</div>
            <div className="participant-close-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="red"
                className="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
