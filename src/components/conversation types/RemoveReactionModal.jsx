import React from "react";
import "../../styles/removereactionmodal.css";
import container from "../../DI/di-container";

export default function RemoveReactionModal(props) {
  let reactionInfo = props.reactionInfo;
  let { stanzaService } = container;

  function handleRemoveReaction(e) {
    e.stopPropagation();
    console.log("handleRemoveReaction");
    // stanzaService.RemoveReaction({ reactionId: reactionInfo.reactionId });
  }

  function handleModalBoundaryClick() {
    console.log("handleModalBoundaryClick");
    props.setShowModal(false);
  }

  return (
    <div className="remove-reaction-modal" onClick={handleModalBoundaryClick}>
      <div className="reacted-by" onClick={handleRemoveReaction}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <div>You</div>
          <div style={{ fontSize: "0.65rem" }}>Tap to remove</div>
        </div>
        <div>{reactionInfo.emoji ? reactionInfo.emoji : ""}</div>
      </div>
    </div>
  );
}
