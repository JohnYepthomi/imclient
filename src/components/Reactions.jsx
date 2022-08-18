import React from "react";

export default function Reactions({ setReactionInfo, setShowModal, message }) {
  function handleReactionClick(e) {
    console.log("handleReactionClick");
    let reactionId = e.target.getAttribute("data-id");
    setReactionInfo({ reactionId });
    setShowModal(true);
  }

  return (
    <React.Fragment>
      {message.reactions && message.reactions.length > 0 && (
        <div
          className="reactions-container"
          data-id={message.id}
          onClick={handleReactionClick}
        >
          {message.reactions.length > 3 && (
            <div className="reaction-count">{message.reactions.length}</div>
          )}
          {message.reactions.map((reaction, idx) => {
            if (idx < 3)
              return (
                <>
                  <div className="reaction" key={idx}>
                    {reaction.emoji}
                  </div>
                </>
              );
          })}
        </div>
      )}
    </React.Fragment>
  );
}
