import React from "react";
import container from "../DI/di-container";

export default function EmojiSelector({ senderjid, message }) {
  const { StanzaService } = container;

  async function handleSelectEmoji(e) {
    let emoji = e.target.innerText;
    let reactionId = e.target.id;
    let reactedby = "self";

    console.log(e.target);

    await StanzaService.sendReaction({
      reactionId,
      reactedby,
      sender: senderjid,
      emoji,
    });

    e.target.parentElement.style.display = "none";
  }

  return (
    <div className="emoji-container">
      <div id={message.id} onClick={handleSelectEmoji}>
        🌈
      </div>
      <div id={message.id} onClick={handleSelectEmoji}>
        ⭐
      </div>
      <div id={message.id} onClick={handleSelectEmoji}>
        ❇️
      </div>
      <div id={message.id} onClick={handleSelectEmoji}>
        ✊
      </div>
      <div id={message.id} onClick={handleSelectEmoji}>
        ⛺
      </div>
    </div>
  );
}
