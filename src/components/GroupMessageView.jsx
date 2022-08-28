import React from "react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Ticks from "./Ticks";
import useLongPress from "../hooks/long.press";
import Reactions from "./Reactions";
import EmojiSelector from "./EmojiSelector";

export default function GroupMessageView({ groupName, setShowModal, setReactionInfo, scrollObject, }) {
  const scrollRef = useRef();
  const groupMessages = useSelector((state) =>
    state.messages.groupMessages.find(
      (groupmsgs) => ((Object.keys(groupmsgs)[0] === groupName))
    )
  );
  const groupParticipants = useSelector((state) =>
    state.messages.groupParticipants.filter((record) => record[groupName])
  );

  const chatLongPressHook = useLongPress(handleChatLongPress, 300, {
    captureEvent: true,
  });

  async function handleChatLongPress() {
    if (this.target.className === "self" || this.target.className === "from") {
      let chat_el = this.target;
      chat_el.firstChild.style.display = "flex";
    }
  }

  function scrollToLastMessage() {
    window.scrollTo(0, scrollRef.current.scrollHeight);
    scrollObject.setScroll(false);
  }

  useEffect(() => {
    scrollToLastMessage();
  }, [scrollObject.scroll]);

  useEffect(() => {
    if (document.contains(document.querySelector(".emoji-container"))) {
      //Hide emoji selector UI
      document.querySelector(".emoji-container").style.display = "none";
    }
    scrollToLastMessage();
  }, [groupMessages]);

  return (
    <div className="message-view-container" ref={scrollRef}>
      {groupMessages &&
        groupMessages[groupName].map((msg, index) => {
            return (
              <React.Fragment key={index}>
                <div
                  className={msg.from === "self" ? "self" : "from"}
                  data-reaction={
                    msg.reactions && msg.reactions.length > 0 ? true : false
                  }
                  {...chatLongPressHook}
                >
                  {/* <EmojiSelector senderjid={groupName} message={msg} /> */}

                  <div className="chat">{msg.body}</div>

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
