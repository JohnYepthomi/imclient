import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/messagesList.css";
import bg from "../assets/background.svg";
export default function MessagesList() {
  const navigate = useNavigate();
  const newMessage = useSelector((state) => state.messages.lastMessage);
  const groupMessages = useSelector((state) => state.messages.groupMessages);
  const directMessages = useSelector((state) => state.messages.directMessages);
  const pendingSetups = useSelector((state) => state.groupSetup.pendingSetups);

  function handleGroupChatClick(gid, senderjid) {
    navigate(`conversation/?type=group&gid=${senderjid}&from=${gid}`);
  }

  function handleChatClick(senderjid) {
    navigate(`conversation/?type=direct&did=${senderjid}`);
  }

  return (
    <div className="messages-container">
      {/*----------Pending Group Setups----------*/}
      {pendingSetups && pendingSetups.length > 0 && (
        <ul className="messages-list">
          {pendingSetups.map((record, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  handleGroupChatClick(record.groupName.split("/")[0], "self");
                }}
              >
                <div className="message-sender-container">
                  <img src={record.img} alt="sender avatar" />
                  <div className="flex-row-container">
                    <div className="sender-name">
                      {record.groupName.split("@")[0]}
                    </div>

                    <div className="message-peek-container">
                      {/* Ticks icon for the last message sent */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        fill="green"
                        class="bi bi-info-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                      </svg>
                      <span className="new-message-peek">Invitations sent</span>
                    </div>
                  </div>
                </div>

                {/* <div className="buttons-container">
                  <div className="last-chat-day">{msg.timestamp}</div>
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
                </div> */}
              </li>
            );
          })}
        </ul>
      )}

      {/*----------DirectMessages----------------*/}
      {directMessages && directMessages.length > 0 && (
        <ul className="messages-list">
          {directMessages.map((msg, index) => {
            return Object.keys(msg).map((record) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    handleChatClick(record.split("/")[0]);
                  }}
                >
                  <div className="message-sender-container">
                    <img src={bg} alt="sender avatar" />
                    <div className="flex-row-container">
                      <div className="sender-name">{record.split("@")[0]}</div>
                      {newMessage.length > 0 &&
                        newMessage.map((message, idx) => {
                          if (message[record]) {
                            return (
                              <div key={idx} className="message-peek-container">
                                {message[record].from === "self" && (
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
                                  {message[record].body}
                                </span>
                              </div>
                            );
                          }
                        })}
                    </div>
                  </div>

                  {/* <div className="buttons-container">
                    <div className="last-chat-day">
                      {getDayFromTimestamp(lastmsg.timestamp)}
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
                  </div> */}
                </li>
              );
            });
          })}
        </ul>
      )}

      {/*----------GroupMessages-----------------*/}
      {groupMessages && groupMessages.length > 0 && (
        <ul className="messages-list">
          {groupMessages.map((records, index) => {
            let msg = Object.values(records)[index][0];
            return (
              <li
                jid={msg.gid}
                key={index}
                onClick={() => {
                  handleGroupChatClick(msg.gid.split("/")[0], msg.from);
                }}
              >
                <div className="message-sender-container">
                  <img src="https://picsum.photos/400" alt="sender avatar" />
                  <div className="flex-row-container">
                    <div className="sender-name">
                      {msg.semderjid.split("@")[0]}
                    </div>

                    <div className="message-peek-container">
                      {/* Ticks icon for the last message sent */}
                      {
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="green"
                          class="bi bi-info-circle-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                        </svg>
                      }

                      <span className="new-message-peek">
                        {msg.createEvent &&
                          `${msg.from.split("@")[0]} added you to the group.`}
                        {msg.joinEvent && "you have been added to the group."}
                        {msg.body && msg.body !== "na" && msg.body}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="buttons-container">
                  <div className="last-chat-day">{msg.timestamp}</div>
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
