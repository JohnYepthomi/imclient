import { createSlice } from "@reduxjs/toolkit";

let localDMs = JSON.parse(localStorage.getItem("directMessages"));
let localLMs = JSON.parse(localStorage.getItem("lastMessage"));

export const messageSlice = createSlice({
  name: "message",

  initialState: {
    directMessages: localDMs || [],
    groupMessages: [],
    lastMessage: localLMs || [],
    deliveryReceipts: [],
  },

  reducers: {
    newDirectMessage: (state, action) => {
      let {
        id,
        from,
        stamp,
        delivered,
        sent,
        isClientMessage,
      } = action.payload;
      let chat = action.payload.body;

      let itemIndex;
      let prevState;
      let entryExist = false;

      state.directMessages.forEach((useritem) => {
        if (useritem[from]) entryExist = true;
      });

      if (entryExist) {
        console.log("updating user messages already stored in redux");
        state.directMessages.forEach((dm, index) => {
          if (dm[from]) {
            prevState = dm[from];
            prevState.unshift({
              from,
              id,
              chat,
              isClientMessage,
              stamp,
              delivered,
              sent,
            });
            itemIndex = index;
          }
        });

        state.directMessages[itemIndex][from] = prevState;
        localStorage.setItem(
          "directMessages",
          JSON.stringify(state.directMessages)
        );
      } else {
        console.log("saving new user messages to redux");
        state.directMessages = [
          {
            [from]: [
              {
                id,
                from,
                chat,
                isClientMessage,
                stamp,
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
      let senderjid = action.payload.from;
      let messagebody = action.payload.body;

      if (state.groupMessages[senderjid]) {
        let prevmsgs = state.groupMessages[senderjid];
        prevmsgs &&
          prevmsgs.push({
            messagebody,
          });

        state.groupMessages[senderjid] = prevmsgs;
      } else {
        state.groupMessages[senderjid] = [
          {
            messagebody,
          },
        ];
      }
    },

    updateLastMessage: (state, action) => {
      if (state.lastMessage.length === 0) {
        state.lastMessage.push({ [action.payload.from]: action.payload });
        localStorage.setItem("lastMessage", JSON.stringify(state.lastMessage));
      } else {
        state.lastMessage = state.lastMessage.filter(
          (lm) => Object.keys(lm)[0] !== action.payload.from
        );

        state.lastMessage.push({ [action.payload.from]: action.payload });
        localStorage.setItem("lastMessage", JSON.stringify(state.lastMessage));
      }
    },

    updateDeliveredMessage: (state, action) => {
      let messageId = action.payload.id;

      state.directMessages.forEach((user, firstIndex) => {
        Object.values(user).forEach((usermessages) => {
          usermessages.forEach((message) => {
            if (message.isClientMessage && message.id === messageId) {
              state.directMessages[firstIndex][message.from].forEach(
                (m, mIndex) => {
                  if (m.id === messageId) {
                    state.directMessages[firstIndex][message.from][
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
              state.directMessages[outerindex][message.from][
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
    },

    removeReaction: (state, action) => {
      let reactionId = action.payload.reactionId;
      let sender = action.payload.jid;
      let removedby = action.payload.removedby;

      state.directMessages.forEach((user, usersIdx) => {
        Object.values(user).forEach((messages) => {
          messages.forEach((message, messageidx) => {
            if (message.id === reactionId) {
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
} = messageSlice.actions;
export default messageSlice.reducer;
