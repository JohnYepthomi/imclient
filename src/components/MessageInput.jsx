import React from "react";
import { useRef } from "react";
import container from "../DI/di-container";

export default function MessageInput({ type, senderId, setScroll, groupName }) {
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
        groupName,
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
          width="15"
          height="16"
          viewBox="0 0 52 52"
          fill="white"
        >
          <path
            d="M2.1,44.5l4.4-16.3h18.6c0.5,0,1-0.5,1-1v-2c0-0.5-0.5-1-1-1H6.5l-4.3-16l0,0C2.1,8,2,7.7,2,7.4
	C2,6.7,2.7,6,3.5,6.1c0.2,0,0.3,0.1,0.5,0.1l0,0l0,0l0,0l45,18.5c0.6,0.2,1,0.8,1,1.4s-0.4,1.1-0.9,1.3l0,0L4,46.4l0,0
	c-0.2,0.1-0.4,0.1-0.6,0.1C2.6,46.4,2,45.8,2,45C2,44.8,2,44.7,2.1,44.5L2.1,44.5z"
          />
        </svg>
      </div>
    </div>
  );
}
