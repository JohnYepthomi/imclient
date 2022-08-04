import { createSlice } from "@reduxjs/toolkit";

let localDMs = JSON.parse(localStorage.getItem("directMessages"));
let localLMs = JSON.parse(localStorage.getItem("lastMessage"));

export const messageSlice = createSlice({
  name: "message",

  initialState: {
    directMessages: [],
    groupMessages: [],
    lastMessage: localLMs || [],
    deliveryReceipts: [],
  },

  reducers: {
    newDirectMessage: (state, action) => {
      let id = action.payload.id;
      let from = action.payload.from;
      let chat = action.payload.body;
      let stamp = action.payload.stamp;
      let delivered = action.payload.delivered;
      let sent = action.payload.sent;
      let isClientMessage = action.payload.isClientMessage;
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
          (lm, index) => Object.keys(lm)[0] !== action.payload.from
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
      let jid = action.payload.jid.split("/")[0];
      let emoji = action.payload.emoji;
      let reactionId = action.payload.reactionId;

      state.directMessages.forEach((users, usersIdx) => {
        if (users[jid]) {
          users[jid].forEach((msgs, msgsIdx) => {
            if (msgs.id === reactionId) {
              // if (msgs.reaction !== emoji) {
              state.directMessages[usersIdx][jid][msgsIdx].reaction = emoji;
              // }
            }
          });
        }
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
} = messageSlice.actions;
export default messageSlice.reducer;
