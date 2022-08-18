import React from "react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Ticks from "./Ticks";
import useLongPress from "../hooks/long.press";
import Reactions from "./Reactions";
import EmojiSelector from "./EmojiSelector";
import styled from "styled-components";

export default function ChatMessageView({
  senderId,
  setShowModal,
  setReactionInfo,
  scrollObject,
}) {
  const scrollRef = useRef();
  const sendermessages = useSelector((state) =>
    state.messages.directMessages.find(
      (usermsgs) => Object.keys(usermsgs)[0] === senderId
    )
  );

  const chatLongPressHook = useLongPress(handleChatLongPress, 300, {
    captureEvent: true,
  });

  async function handleChatLongPress() {
    if (this.target.className === "self" || this.target.className === "from") {
      let chat_el = this.target;
      console.log("handleChatLongPress: ", this.target.previousSibling);
      chat_el.firstChild.style.display = "flex";
    }
  }

  function scrollToLastMessage() {
    window.scrollTo(0, scrollRef.current.scrollHeight);
    scrollObject.setScroll(false);
  }

  let Chat = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    gap: 5px;
    font-size: 0.85rem;
    padding: 17px;
    margin-top: 40px;
    min-height: calc(100vh - 35px);
    background-color: white;
  `;

  useEffect(() => {
    scrollToLastMessage();
  }, [scrollObject.scroll]);

  useEffect(() => {
    if (document.contains(document.querySelector(".emoji-container"))) {
      //Hide emoji selector UI
      document.querySelector(".emoji-container").style.display = "none";
    }
    scrollToLastMessage();
    console.log("MessageView useEffect");
  }, [sendermessages]);

  return (
    <div className="message-view-container" ref={scrollRef}>
      {sendermessages &&
        sendermessages[senderId].map((msg, index) => {
          return (
            <React.Fragment key={index}>
              <div
                className={msg.from === "self" ? "self" : "from"}
                data-reaction={
                  msg.reactions && msg.reactions.length > 0 ? true : false
                }
                {...chatLongPressHook}
              >
                <EmojiSelector senderjid={senderId} message={msg} />

                <div style={{ marginBottom: "0px" }} className="chat">
                  {msg.body}
                </div>
                <Ticks message={msg} />

                <Reactions
                  setShowModal={setShowModal}
                  setReactionInfo={setReactionInfo}
                  message={msg}
                />
              </div>
            </React.Fragment>
          );
        })}
    </div>
  );
}
