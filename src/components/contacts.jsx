import React, { useState, useEffect } from "react";
import "../styles/contacts.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion/dist/framer-motion";
import {
  setSelectionComplete,
  updateSelection,
  disableEditMode,
  setSelectionStart,
  setSelectionEnd,
} from "../features/groupSetupSlice";
import { setView } from "../features/floatingButtonSlice";

export default function Contacts({ pageVariants, pageTransition, pageStyle }) {
  let user_roster = [
    {
      jid: "samuel@localhost",
      name: "Sam Harris",
      status: "at the movies 🎥",
      avatar: "https://picsum.photos/600",
    },
    {
      jid: "john@localhost",
      name: "John",
      status: "on the road 🏍️",
      avatar: "https://picsum.photos/300",
    },
    {
      jid: "peter@localhost",
      name: "Peter Parker",
      status: "dying from heat  🌞",
      avatar: "https://picsum.photos/400",
    },
    {
      jid: "pratick@localhost",
      name: "Pratick Aggarwalla",
      status: "all i want is haloween 🎃",
      avatar: "https://picsum.photos/100",
    },
    {
      jid: "shashank@localhost",
      name: "Shashank M Mishra",
      status: "Busy at work 🏢",
      avatar: "https://picsum.photos/200",
    },
  ];
  const isEditMode = useSelector((state) => state.groupSetup.editMode);
  const isSelectionStarted = useSelector(
    (state) => state.groupSetup.selectionStarted
  );
  const [selectedContacts, setSelectedContacts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleContactClick(contactjid) {
    if (!isSelectionStarted) dispatch(setSelectionStart());

    if (!selectedContacts.includes(contactjid))
      setSelectedContacts((state) => [...state, contactjid]);
    else
      setSelectedContacts((state) => {
        return state.filter((contact) => contact !== contactjid);
      });
  }

  function unMountCleanUp() {
    if (isEditMode) {
      dispatch(disableEditMode());
      dispatch(setSelectionEnd());
      dispatch(setSelectionComplete());
    }
  }

  /* Back/Forward Keys */
  window.onpopstate = () => {
    unMountCleanUp();
  };

  /* local state */
  useEffect(() => {
    if (isEditMode) {
      dispatch(updateSelection(selectedContacts));
      if (selectedContacts.length === 0) dispatch(setSelectionEnd());
    }
  }, [selectedContacts]);

  /* CleanUp on unmount */
  useEffect(() => {
    return () => unMountCleanUp();
  }, []);

  if (isEditMode)
    return (
      <React.Fragment>
        <ul
          className="roster-whitelist"
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            zIndex: 999,
            backgroundColor: "white",
          }}
        >
          <div
            className="contact-selection-header"
            style={{
              height: "40px",
              width: "100%",
              backgroundColor: "#4f854f",
              padding: "10px",
              color: "white",
            }}
          >
            New Group
          </div>
          {user_roster.map((user_contact, index) => {
            return (
              <li
                className="roster-item"
                jid={user_contact.jid}
                onClick={() => handleContactClick(user_contact.jid)}
              >
                <div className="roster-item-avatar">
                  <img src={user_contact.avatar} alt="contact_avatar" />
                  {selectedContacts &&
                    selectedContacts.includes(user_contact.jid) && (
                      <div
                        className="selected-check-icon"
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          width: "fit-content",
                          height: "fit-content",
                          right: " -5px",
                          border: "2px solid white",
                          borderRadius: "50%",
                          backgroundColor: "white",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#4f854f"
                          class="bi bi-check-circle-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                      </div>
                    )}
                </div>
                <div className="roster-item-name">
                  <div className="roster-item-name-text">
                    <span className="roster-item-name-text-name">
                      {user_contact.name}
                    </span>
                    <span className="roster-item-name-text-status">
                      {user_contact.status}
                    </span>
                  </div>

                  <div style={{ paddingRight: "10px" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      fill="#008069"
                      className="bi bi-telephone-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                      />
                    </svg>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  else
    return (
      <React.Fragment>
        <ul className="roster-whitelist">
          {user_roster.map((user_contact, index) => {
            return (
              <Link
                to={`/conversation/${user_contact.jid}?source=contacts`}
                key={index}
              >
                <li className="roster-item" jid={user_contact.jid}>
                  <div className="roster-item-avatar">
                    <img src={user_contact.avatar} alt="contact_avatar" />
                  </div>
                  <div className="roster-item-name">
                    <div className="roster-item-name-text">
                      <span className="roster-item-name-text-name">
                        {user_contact.name}
                      </span>
                      <span className="roster-item-name-text-status">
                        {user_contact.status}
                      </span>
                    </div>

                    <div style={{ paddingRight: "10px" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        fill="#008069"
                        className="bi bi-telephone-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                        />
                      </svg>
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </React.Fragment>
    );
}
