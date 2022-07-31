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
      let messageId = action.payload.id;
      let senderjid = action.payload.from;
      let message = action.payload.body;
      let stamp = action.payload.stamp;
      let delivered = action.payload.delivered;
      let sent = action.payload.sent;
      let isClientMessage = action.payload.isClientMessage;
      let itemIndex;
      let prevState;

      if (state.directMessages.some((msg) => msg[senderjid] !== null)) {
        console.log("updating user messages already stored in redux");
        state.directMessages.forEach((dm, index) => {
          if (dm[senderjid]) {
            prevState = dm[senderjid];
            prevState.unshift({
              from: senderjid,
              id: messageId,
              chat: message,
              isClientMessage: isClientMessage ? true : false,
              stamp,
              delivered: delivered ? true : false,
              sent: sent ? true : false,
            });
            itemIndex = index;
          }
        });

        state.directMessages[itemIndex][senderjid] = prevState;
        localStorage.setItem(
          "directMessages",
          JSON.stringify(state.directMessages)
        );
      } else {
        console.log("saving new user messages to redux");
        state.directMessages = [
          {
            [senderjid]: [
              {
                id: messageId,
                from: senderjid,
                chat: message,
                isClientMessage: isClientMessage ? true : false,
                stamp,
                delivered: delivered ? true : false,
                sent: sent ? true : false,
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
  },
});

export const {
  newDirectMessage,
  newGroupMessage,
  updateLastMessage,
  updateDeliveredMessage,
  updateSentMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
