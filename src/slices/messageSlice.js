import { createSlice } from "@reduxjs/toolkit";

let localDMs = JSON.parse(localStorage.getItem("directMessages"));
let localLMs = JSON.parse(localStorage.getItem("lastMessage"));

export const messageSlice = createSlice({
  name: "message",

  initialState: {
    directMessages: localDMs || [],
    groupMessages: [],
    lastMessage: localLMs || [],
    lastGroupMessage: [],
    deliveryReceipts: [],
    groupParticipants: [],
    tempParticipants: [],
  },

  reducers: {
    newDirectMessage: (state, action) => {
      let {
        id,
        from,
        timestamp,
        sender,
        delivered,
        sent,
        body,
      } = action.payload;

      let recordExist = false;

      state.directMessages.forEach((useritem) => {
        if (useritem[sender]) recordExist = true;
      });

      if (recordExist) {
        state.directMessages.forEach((records, index) => {
          if (records[sender]) {
            let prevState = records[sender];
            prevState.unshift({
              from,
              id,
              body,
              timestamp,
              delivered,
              sender,
              sent,
            });
            state.directMessages[index][sender] = prevState;
          }
        });

        localStorage.setItem(
          "directMessages",
          JSON.stringify(state.directMessages)
        );
      } else {
        state.directMessages = [
          {
            [sender]: [
              {
                id,
                from,
                body,
                sender,
                timestamp,
                delivered,
                sent,
              },
            ],
          },
          ...state.directMessages,
        ];
        localStorage.setItem(
          "directMessages",
          JSON.stringify(state.directMessages)
        );
      }
    },

    newGroupMessage: (state, action) => {
      let {
        id,
        gid,
        from,
        body,
        timestamp,
        delivered,
        sent,
        joinEvent,
        createEvent,
      } = action.payload;
      let groupName = gid.split("@")[0];

      if (state.groupMessages.some((record) => record[groupName] !== null)) {
        let prevmsgs;

        state.groupMessages.forEach((record, index) => {
          if (record[groupName]) {
            prevmsgs = record[groupName];
            prevmsgs.push({
              id,
              gid,
              from,
              body,
              timestamp,
              delivered,
              sent,
              joinEvent,
              createEvent,
            });
            state.groupMessages[index][groupName] = prevmsgs;
          }
        });
      } else {
        state.groupMessages.push({
          [groupName]: [
            {
              id,
              gid,
              from,
              body,
              timestamp,
              delivered,
              sent,
              joinEvent,
              createEvent,
            },
          ],
        });
      }
    },

    setGroupParticipants: (state, action) => {
      let participants = action.payload.participants;
      let groupName = action.payload.groupName;

      if (state.groupParticipants.some((p) => p[groupName])) {
        state.groupParticipants.map((p) => {
          if (p[groupName]) {
            return [...p[groupName], participants];
          }
        });
      } else {
        state.groupParticipants.push({ [groupName]: participants });
      }
    },

    setTempParticipants: (state, action) => {
      state.tempParticipants = action.payload;
    },

    updateLastMessage: (state, action) => {
      let newMessage = action.payload;
      let placeholder = newMessage.hasOwnProperty("gid")
        ? newMessage.gid /* if group*/
        : newMessage.sender; /* if chat */

      if (state.lastMessage.length === 0) {
        state.lastMessage.push({ [placeholder]: newMessage });
        localStorage.setItem("lastMessage", JSON.stringify(state.lastMessage));
      } else {
        state.lastMessage = state.lastMessage.filter(
          (lm) => Object.keys(lm)[0] !== placeholder
        );

        state.lastMessage.push({ [placeholder]: newMessage });
        localStorage.setItem("lastMessage", JSON.stringify(state.lastMessage));
      }
    },

    updateLastGroupMessage: (state, action) => {
      if (state.lastGroupMessage.length === 0) {
        state.lastGroupMessage.push({ [action.payload.from]: action.payload });
        localStorage.setItem(
          "lastGroupMessage",
          JSON.stringify(state.lastGroupMessage)
        );
      } else {
        state.lastGroupMessage = state.lastGroupMessage.filter(
          (lm) => Object.keys(lm)[0] !== action.payload.from
        );

        state.lastGroupMessage.push({ [action.payload.from]: action.payload });
        localStorage.setItem(
          "lastGroupMessage",
          JSON.stringify(state.lastGroupMessage)
        );
      }
    },

    updateDeliveredMessage: (state, action) => {
      let messageId = action.payload.id;

      state.directMessages.forEach((user, firstIndex) => {
        Object.values(user).forEach((usermessages) => {
          usermessages.forEach((message) => {
            if (message.from === "self" && message.id === messageId) {
              state.directMessages[firstIndex][message.sender].forEach(
                (m, mIndex) => {
                  if (m.id === messageId) {
                    state.directMessages[firstIndex][message.sender][
                      mIndex
                    ].delivered = true;
                  }
                }
              );
            }
          });
        });
      });
    },

    updateSentMessage: (state, action) => {
      let messageId = action.payload.id;
      state.directMessages.forEach((users, outerindex) => {
        Object.values(users).forEach((usermessages, midIndex) => {
          usermessages.forEach((message) => {
            if (message.id === messageId)
              state.directMessages[outerindex][message.sender][
                midIndex
              ].sent = true;
          });
        });
      });
    },

    updateReaction: (state, action) => {
      let reactionId = action.payload.reactionId;
      let reactedby = action.payload.reactedby;
      let emoji = action.payload.emoji;

      let usridx;
      let foundJID;
      let foundMsg;

      state.directMessages.forEach((userdata, usersIdx) => {
        Object.values(userdata).forEach((messages) => {
          messages.forEach((message) => {
            if (message.id === reactionId) {
              usridx = usersIdx;
              foundJID = Object.keys(userdata)[0];
              foundMsg = state.directMessages[usersIdx][foundJID];
            }
          });
        });
      });

      if (foundMsg) {
        foundMsg.forEach((message, messageidx) => {
          if (message.id == reactionId) {
            if (message.reactions) {
              /* Check if the emoji even exists */
              let emojiExistInReactions = message.reactions.some(
                (reaction) => reaction.emoji === emoji
              );

              if (emojiExistInReactions) {
                message.reactions.forEach((reaction, reactionidx) => {
                  if (reaction.emoji !== emoji) {
                    message.reactions[reactionidx].reactors.forEach(
                      (reactor, reactoridx) => {
                        let numOfReactors =
                          message.reactions[reactionidx].reactors.length;

                        if (reactor === reactedby) {
                          if (numOfReactors > 1) {
                            foundMsg[messageidx].reactions[
                              reactionidx
                            ].reactors.splice(reactoridx, 1);
                          } else {
                            foundMsg[messageidx].reactions.splice(
                              reactionidx,
                              1
                            );
                          }
                        }
                      }
                    );
                  }
                });
              } else {
                /* Remove user's previous reaction if any */
                foundMsg[messageidx].reactions.forEach(
                  (reaction, reactionidx) => {
                    let numOfReactors =
                      message.reactions[reactionidx].reactors.length;
                    reaction.reactors.forEach((reactor, reactoridx) => {
                      if (reactor === reactedby) {
                        if (numOfReactors > 1) {
                          foundMsg[messageidx].reactions[
                            reactionidx
                          ].reactors.splice(reactoridx, 1);
                        } else {
                          foundMsg[messageidx].reactions.splice(reactionidx, 1);
                        }
                      }
                    });
                  }
                );

                /* update reactions with new emoji */
                foundMsg[messageidx].reactions.push({
                  emoji,
                  count: 1,
                  reactors: [reactedby],
                });
              }
            } else {
              foundMsg[messageidx].reactions = [
                {
                  emoji,
                  reactors: [reactedby],
                  count: 1,
                },
              ];
            }
          }
        });

        state.directMessages[usridx][foundJID] = foundMsg;
      }

      localStorage.setItem(
        "directMessages",
        JSON.stringify(state.directMessages)
      );
    },

    removeReaction: (state, action) => {
      let reactionId = action.payload.reactionId;
      let sender = action.payload.jid;
      let removedby = action.payload.removedby;

      state.directMessages.forEach((user, usersIdx) => {
        Object.values(user).forEach((messages) => {
          messages.forEach((message, messageidx) => {
            if (message.id === reactionId) {
              message.reactions &&
                message.reactions.forEach((reaction, reactionidx) => {
                  reaction.reactors.forEach((reactor) => {
                    if (removedby === reactor) {
                      state.directMessages[usersIdx][sender][
                        messageidx
                      ].reactions.splice(reactionidx, 1);
                    }
                  });
                });
            }
          });
        });
      });

      localStorage.setItem(
        "directMessages",
        JSON.stringify(state.directMessages)
      );
    },
  },
});

export const {
  newDirectMessage,
  newGroupMessage,
  updateLastMessage,
  updateDeliveredMessage,
  updateSentMessage,
  updateReaction,
  removeReaction,
  setGroupParticipants,
  setTempParticipants,
} = messageSlice.actions;
export default messageSlice.reducer;
