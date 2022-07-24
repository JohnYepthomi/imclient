import React from "react";
import "../styles/contacts.css";
import { Link } from "react-router-dom";

export default function Contacts() {
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

  return (
    <div className="roster-container">
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
    </div>
  );
}
