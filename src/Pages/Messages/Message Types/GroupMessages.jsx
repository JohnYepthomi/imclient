import React from "react";
import { useState } from "react";
import container from "../../../DI/di-container";
import MessageInput from "../../../components/MessageInput";
import MessageHeader from "../../../components/MessageHeader";
import { RemoveReactionModal } from "./../RemoveReactionModal";
import GroupMessageView from "../../../components/GroupMessageView";

export default function GroupMessages({ gid, nick }) {
  const [scroll, setScroll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reactionInfo, setReactionInfo] = useState();
  const groupJid = gid + "@conference.localhost/" + nick;
  const groupName = gid;
  const { StanzaService } = container;

  async function sendInvites() {
    StanzaService.xepList().sendDirectInvitations(groupJid);
  }

  return (
    <div style={{ position: "absolute", width: "100%", top: 0, zIndex: 9999 }}>
      <MessageHeader type="groupChat" senderId={groupJid} />
      <GroupMessageView
        setShowModal={setShowModal}
        setReactionInfo={setReactionInfo}
        groupName={groupName}
        scrollObject={{ scroll, setScroll }}
      />
      <button
        style={{
          outline: "none",
          backgrounColor: "darkgreen",
          color: "white",
          padding: "10px",
        }}
        onClick={() => {
          sendInvites();
        }}
      >
        Invite Participants
      </button>
      <MessageInput
        type="groupchat"
        senderId={groupJid}
        setScroll={setScroll}
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
