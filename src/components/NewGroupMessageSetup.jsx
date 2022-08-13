import React, { useEffect } from "react";
import "../styles/NewGroupMessageSetup.css";
import { motion } from "framer-motion/dist/framer-motion";
import { Link } from "react-router-dom";
import { clearSelectedParticipants } from "../features/groupSetupSlice";
import { setView } from "../features/floatingButtonSlice";
import { useSelector, useDispatch } from "react-redux";

export default function NewGroupMessageSetup() {
  const dispatch = useDispatch();
  const selectedParticipants = useSelector(
    (state) => state.groupSetup.selectedParticipants
  );

  useEffect(() => {
    dispatch(setView("group-setup"));

    return () => {
      console.log("cleanup called");
      dispatch(clearSelectedParticipants());
      dispatch(setView("chats"));
    };
  }, []);

  return (
    <motion.div
      // variants={pageVariants}
      // transition={pageTransition}
      style={{ position: "absolute", top: 0, width: "100%" }}
    >
      <div className="groupsetup-header">
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
        </Link>
        <div className="groupsetup-text">
          <div className="title">New Group</div>
          <div className="subject">Add subject</div>
        </div>
      </div>
      <div className="group-setup-container">
        <div className="new-group-name">
          <div className="add-image-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              class="bi bi-camera-fill"
              viewBox="0 0 16 16"
            >
              <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
              <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="name"
            placeholder="Type group subject here..."
          />
        </div>

        <div className="participants-container">
          <div className="header">
            Paticipants: {selectedParticipants.length}
          </div>
          <div className="participants-list">
            {selectedParticipants &&
              selectedParticipants.map((participant, index) => {
                return (
                  <div className="participant-details" key={index}>
                    <div className="profile-image">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="gray"
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
                    <div className="participant-name">
                      {participant.split("@")[0]}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
