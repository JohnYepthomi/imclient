import React from "react";
import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/messagesList.css";
import { motion } from "framer-motion/dist/framer-motion";

export default function MessagesList() {
  const [messages, setMessages] = useState();
  const newMessage = useSelector((state) => state.messages.lastMessage);
  const navigate = useNavigate();

  function getDayFromTimestamp(timestamp) {
    const m_d_y = timestamp.split(" ")[0].split("/"); //temporary dummy timestamp; needs changes when using real data;
    const messageDate = new Date(m_d_y);
    const currentdate = new Date().getDate();
    const diffTime = Math.abs(currentdate - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return timestamp.split(" ")[0];
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    }
  }

  function handleChatClick(senderjid) {
    navigate(`conversation/${senderjid.split("/")[0]}?source=chats`);
  }

  useEffect(() => {
    let msgs = [
      {
        jid: "samuel@localhost",
        chat: "Yes, im avail now!!",
        type: "direct-message",
        timestamp: "06/23/2022 12:56 P.M",
        avatar: "https://picsum.photos/400",
      },
      {
        jid: "pratick@localhost",
        chat: "Yes, im avail now!!",
        type: "direct-message",
        timestamp: "06/12/2022 12:56 P.M",
        avatar: "https://picsum.photos/300",
      },
      {
        jid: "shashank@localhost",
        chat: "Yes, im avail now!!",
        type: "direct-message",
        timestamp: "03/12/2022 12:56 P.M",
        avatar: "https://picsum.photos/200",
      },
      {
        jid: "peter@localhost",
        chat: "Yes, im avail now!!",
        type: "direct-message",
        timestamp: "03/26/2022 12:56 P.M",
        avatar: "https://picsum.photos/100",
      },
    ];
    console.log("messageList useEffect");
    setMessages(msgs);
  }, []);

  return (
    <React.Fragment>
      <div className="messages-container">
        <ul className="messages-list">
          {messages &&
            messages.map((msg, index) => {
              return (
                // <Link
                //   to={`conversation/${msg.jid.split("/")[0]}?source=chats`}
                //   key={index}
                // >
                <li
                  jid={msg.jid}
                  key={index}
                  onClick={() => {
                    handleChatClick(msg.jid.split("/")[0]);
                  }}
                >
                  <div className="message-sender-container">
                    <img src={msg.avatar} alt="sender avatar" />
                    <div className="flex-row-container">
                      <div className="sender-name">{msg.jid.split("@")[0]}</div>
                      {newMessage.length > 0 &&
                        newMessage.map((message, idx) => {
                          if (message[msg.jid]) {
                            return (
                              <div key={idx} className="message-peek-container">
                                {message[msg.jid].isClientMessage && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="13"
                                    height="13"
                                    fill="currentColor"
                                    className="bi bi-check2-all"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z" />
                                    <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z" />
                                  </svg>
                                )}

                                <span className="new-message-peek">
                                  {message[msg.jid].body}
                                </span>
                              </div>
                            );
                          }
                        })}
                    </div>
                  </div>
                  <div className="buttons-container">
                    <div className="last-chat-day">
                      {getDayFromTimestamp(msg.timestamp)}
                    </div>
                    <div className="more-buttons">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        fill="gray"
                        className="bi bi-pin-angle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
                      </svg>
                    </div>
                  </div>
                </li>
                // </Link>
              );
            })}
        </ul>
      </div>

      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
        }}
        className="new-message-button"
      >
        <Link to="/contacts">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            class="bi bi-chat-square-text"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
          </svg>
        </Link>
      </motion.div>
    </React.Fragment>
  );
}
