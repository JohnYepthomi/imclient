import React from "react";
import GroupMessages from "./Message Types/GroupMessages";
import DirectMessages from "./Message Types/DirectMessages";
import { useSearchParams } from "react-router-dom";
import "./Messages.css";

/**
 * @type string  - Type of message.
 * @senderjid string - The id of the user in a chat/group message.
 * @nick string - Nickname of user in a muc room.
 * @gid string - The room jid in a group chat.
 */

export default function Messages() {
  const [searchParams] = useSearchParams();
  let type = searchParams.get("type");
  let groupName, nick, senderjid, completed;

  if (type === "direct") {
    senderjid = searchParams.get("did");
  } else if (type === "group") {
    groupName = searchParams.get("name");
    nick = searchParams.get("nick");
    senderjid = searchParams.get("from");
  }

  return type === "direct" ? (
    <DirectMessages senderjid={senderjid} />
  ) : (
    <GroupMessages groupName={groupName} nick={nick} senderjid={senderjid} />
  );
}
