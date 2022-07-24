import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  newDirectMessage,
  updateLastMessage,
} from "../../features/messageSlice";
import MessageSendQueue from "../../utils/MessageSendQueue";

export default function DirectMessages({ senderjid }) {
  const messageInputRef = useRef();
  const dispatch = useDispatch();
  const sendermessages = useSelector((state) =>
    state.messages.directMessages.find(
      (usermsgs) => Object.keys(usermsgs)[0] === senderjid
    )
  );

  const handleMessageInputEnter = (e) => {
    if (e.keyCode === 13) {
      let $input = messageInputRef.current;
      let message = $input.value;

      if (message !== "") {
        queueAndDispatchMessage(message);
        $input.value = "";
        $input.focus();
        scrollToLastMessage();
      }
    }
  };

  const handleMessageSendButtonClick = (e) => {
    let $input = messageInputRef.current;
    let message = $input.value;

    if (message !== "") {
      queueAndDispatchMessage(message);
      $input.value = "";
      $input.focus();
      scrollToLastMessage();
    }
  };

  function queueAndDispatchMessage(message) {
    let newMessage = {
      from: senderjid,
      body: message,
      stamp: getTimestamp(),
      isClientMessage: true,
      delivered: false,
      sent: false,
    };

    MessageSendQueue.add({ senderjid, message });
    dispatch(newDirectMessage(newMessage));
    dispatch(updateLastMessage(newMessage));
  }

  function getTimestamp() {
    var d = new Date();
    let H = d.getHours(),
      M = d.getMinutes(),
      S = d.getSeconds(),
      MONTH = d.getMonth(),
      DAY = d.getDate();

    return `${DAY}/${MONTH}-${H}:${M}:${S}`;
  }

  function scrollToLastMessage() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  function getBookmark(index, messages, senderjid) {
    let MONTHS_STRING = [
      "na",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "JULY",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let timestamp = messages[senderjid][index].stamp;
    let time = timestamp.split("-")[0];
    let day = +time.split("/")[0];
    let month = +time.split("/")[1];
    if (index > 0) {
      let _prevTimestamp = messages[senderjid][index - 1].stamp;
      let _prevTime = _prevTimestamp.split("-")[0];
      let _prevDay = +_prevTime.split("/")[0];
      let _prevMonth = +_prevTime.split("/")[1];

      let C = new Date(`${month}/${day}/2022`);
      let P = new Date(`${_prevMonth}/${_prevDay}/2022`);
      const diffTime = Math.abs(C - P);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays !== 0) return `${day} ${MONTHS_STRING[month]}`;
    } else if (index === 0 && messages.length === 1) {
      return `${day} ${MONTHS_STRING[month]}`;
    }
  }

  useEffect(() => {
    console.log("use effect");
    scrollToLastMessage();
  }, [sendermessages]);

  return (
    <>
      <div className="queue-logger">Logger</div>
      <div className="message-header">
        <Link to="/">
          <div className="back-button">
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
          </div>
        </Link>

        <div className="user-info" senderjid={senderjid}>
          <div className="user-name">{senderjid.split("@")[0]}</div>
        </div>

        <div className="message-buttons">
          <div className="more">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-three-dots"
              viewBox="0 0 16 16"
            >
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="message-view-container">
        {sendermessages &&
          sendermessages[senderjid].map((msg, index) => {
            let bookmark = getBookmark(index, sendermessages, senderjid);

            return (
              <>
                <div
                  className={msg.isClientMessage ? "self" : "from"}
                  key={index}
                >
                  <div className="chat">{msg.chat}</div>

                  <div className="stamp-ticks-container">
                    <div className="stamp">{msg.stamp.split("-")[1]}</div>
                    <div>
                      {msg.isClientMessage === true ? (
                        true === true ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            fill="currentColor"
                            class="bi bi-check2"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            fill="currentColor"
                            class="bi bi-check2-all"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z" />
                            <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z" />
                          </svg>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                {bookmark && <div className="date-bookmark">{bookmark}</div>}
              </>
            );
          })}
      </div>

      <div className="message-input-container">
        <input
          type="text"
          ref={messageInputRef}
          className="message-input"
          placeholder="Type a message..."
          onKeyDown={handleMessageInputEnter}
        />
        <div
          className="message-send-button"
          onClick={handleMessageSendButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
          </svg>
        </div>
      </div>
    </>
  );
}
