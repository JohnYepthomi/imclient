import React from "react";
import { useRef } from "react";
import container from "../DI/di-container";

export default function MessageInput({ type, senderId, setScroll }) {
  const messageInputRef = useRef();
  const { StanzaService } = container;

  const handleMessageInputEnter = async (e) => {
    if (e.keyCode === 13) {
      let $input = messageInputRef.current;
      let message = $input.value;

      if (message !== "") {
        await composeAndSendMessage(message);
        $input.value = "";
        $input.focus();
        setScroll(true);
      }
    }
  };

  const handleMessageSendButtonClick = async (e) => {
    let $input = messageInputRef.current;
    let message = $input.value;

    if (message !== "") {
      await composeAndSendMessage(message);
      $input.value = "";
      $input.focus();
      setScroll(true);
    }
  };

  async function composeAndSendMessage(message) {
    if (type == "chat") {
      let newMessage = {
        jid: senderId,
        body: message,
      };

      await StanzaService.sendChat(newMessage);
    } else if (type === "groupchat") {
      let newMessage = {
        gid: senderId,
        body: message,
      };

      await StanzaService.sendGroupChat(newMessage);
    }
  }

  return (
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
          width="18"
          height="18"
          fill="white"
          className="bi bi-send-fill"
          viewBox="0 0 16 16"
        >
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
        </svg>
      </div>
    </div>
  );
}
