import React from "react";
import MessageInput from "../../../components/MessageInput";
import MessageHeader from "../../../components/MessageHeader";
import { RemoveReactionModal } from "./../RemoveReactionModal";
import { useState } from "react";
import ChatMessageView from "../../../components/ChatMessageView";

export default function DirectMessages({ senderjid }) {
  const [reactionInfo, setReactionInfo] = useState();
  const [showModal, setShowModal] = useState(false);
  const [scroll, setScroll] = useState(false);

  return (
    <div
      className="direct-message-container"
      style={{ position: "absolute", width: "100%", top: 0, zIndex: 9999 }}
    >
      <MessageHeader type="chat" senderId={senderjid} />
      <ChatMessageView
        setShowModal={setShowModal}
        setReactionInfo={setReactionInfo}
        senderId={senderjid}
        scrollObject={{ scroll, setScroll }}
      />
      <MessageInput type="chat" senderId={senderjid} setScroll={setScroll} />
      {showModal && (
        <RemoveReactionModal
          type="chat"
          senderId={senderjid}
          reactionInfo={reactionInfo}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}
