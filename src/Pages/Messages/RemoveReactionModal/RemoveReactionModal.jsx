import React from "react";
import container from "../../../DI/di-container";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./removereactionmodal.css";

export default function RemoveReactionModal(props) {
  let reactionId = props.reactionInfo.reactionId;
  let senderjid = props.senderId;
  let directMessages = useSelector((state) => state.messages.directMessages);
  const [selfReaction, setSelfReaction] = useState();
  const [senderReactions, setSenderReactions] = useState([]);
  let { StanzaService } = container;

  function preventModalExit(e) {
    e.stopPropagation();
  }

  function handleModalBoundaryClick() {
    props.setShowModal(false);
  }

  function handleRemoveUserReaction(e) {
    let reactionId = e.target.getAttribute("data-reactionid");

    StanzaService.removeReaction({
      reactionId,
      to: senderjid,
    });

    setSelfReaction(); //re-render
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
                else setSelfReaction({ emoji: reaction.emoji, reactionId });
              });

              if (reactors.length > 0)
                setSenderReactions((state) => [
                  ...state,
                  { emoji: reaction.emoji, reactors, reactionId },
                ]);
            });
          }
        });
      });
    });
  }

  useEffect(() => {
    populateReactions();
  }, [directMessages]);

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
          {selfReaction && (
            <div
              className="modal-reaction"
              data-reactionid={selfReaction.reactionId}
              onClick={handleRemoveUserReaction}
            >
              <div className="reactor-info">
                <div className="reactor-name">You</div>
                <div className="self-reaction-remove-info">Tap to remove</div>
              </div>
              <div className="reactor-emoji">{selfReaction.emoji}</div>
            </div>
          )}
          {senderReactions &&
            senderReactions.map((reaction) => {
              return reaction.reactors.map((reactor) => {
                return (
                  <div className="modal-reaction">
                    <div className="reactor-info">
                      <div className="reactor-name">
                        {reactor.split("@")[0]}
                      </div>
                    </div>
                    <div className="reactor-emoji">{reaction.emoji}</div>
                  </div>
                );
              });
            })}
        </div>
      </div>
    </div>
  );
}
