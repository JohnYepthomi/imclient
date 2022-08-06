import React from "react";
import "../../styles/removereactionmodal.css";
import container from "../../DI/di-container";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function RemoveReactionModal(props) {
  let reactionId = props.reactionInfo.reactionId;
  let directMessages = useSelector((state) => state.messages.directMessages);
  const [selfReaction, setSelfReaction] = useState();
  const [senderReactions, setSenderReactions] = useState([]);

  function preventModalExit(e) {
    e.stopPropagation();
  }

  function handleModalBoundaryClick() {
    console.log("handleModalBoundaryClick");
    props.setShowModal(false);
  }

  function populateReactions() {
    directMessages.forEach((user) => {
      Object.values(user).forEach((messages) => {
        messages.forEach((message) => {
          if (message.id === reactionId) {
            message.reactions.forEach((reaction) => {
              let reactors = [];

              reaction.reactors.forEach((reactor) => {
                if (reactor !== "self") reactors.push(reactor);
                else setSelfReaction(reaction.emoji);
              });

              if (reactors.length > 0)
                setSenderReactions((state) => [
                  ...state,
                  { emoji: reaction.emoji, reactors },
                ]);
            });
          }
        });
      });
    });
  }

  useEffect(() => {
    populateReactions();
    console.log({ senderReactions });
  }, []);

  return (
    <div className="remove-reaction-modal" onClick={handleModalBoundaryClick}>
      <div className="reacted-by" onClick={preventModalExit}>
        <div className="reaction-modal-header">
          <div className="all-reactors">All</div>
          {senderReactions &&
            senderReactions.map((reaction) => {
              console.log({ reaction });
              return (
                <div className="header-emoji">
                  <div>{reaction.emoji}</div>
                  <div>{reaction.reactors.length}</div>
                </div>
              );
            })}
        </div>
        <div className="all-reactions">
          <div className="reaction">
            <div className="reactor-info">
              <div className="reactor-name">You</div>
              <div className="self-reaction-remove-info">Tap to remove</div>
            </div>
            <div className="reactor-emoji">{selfReaction}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
