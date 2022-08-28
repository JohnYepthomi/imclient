import React from "react";
import { useState } from "react";
import container from "../../../DI/di-container";
import MessageInput from "../../../components/MessageInput";
import MessageHeader from "../../../components/MessageHeader";
import { RemoveReactionModal } from "./../RemoveReactionModal";
import GroupMessageView from "../../../components/GroupMessageView";

export default function GroupMessages({ groupName, nick }) {
  const [scroll, setScroll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reactionInfo, setReactionInfo] = useState();
  const groupJid = groupName + "@conference.localhost/" + nick;
  const { StanzaService } = container;

  async function sendInvites() {
    StanzaService.xepList().sendDirectInvitations(groupJid);
  }

  return (
    <div
      className="group-message-container"
      style={{ 
        position: "absolute",
        width: "100%",
        top: 0,
        zIndex: 9999
      }}
    >
      <MessageHeader type="groupChat" senderId={groupJid} />
      <GroupMessageView
        setShowModal={setShowModal}
        setReactionInfo={setReactionInfo}
        groupName={groupName}
        scrollObject={{ scroll, setScroll }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <button
          onClick={() => {
            sendInvites();
          }}

          style={{
            outline: "none",
            color: "white",
            border: "none",
            padding: "10px",
            margin: "50px",
            marginBottom: "40px",
            borderRadius: "10px",
            boxShadow: "-3px 4px 15px -1px black",
            border: "1px solid darkseagreen",
            backgroundColor: "#41784a",
            cursor: "pointer",
          }}
        >
          Invite Participants
        </button>
      </div>
      <MessageInput
        type="groupchat"
        senderId={groupJid}
        setScroll={setScroll}
        groupName={groupName}
      />
      {showModal && (
        <RemoveReactionModal
          type="groupChat"
          senderId={groupName}
          reactionInfo={reactionInfo}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}
