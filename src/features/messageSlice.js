import { createSlice, createReducer } from "@reduxjs/toolkit";

let localDMs = JSON.parse(localStorage.getItem("directMessages"));
let localLMs = JSON.parse(localStorage.getItem("lastMessage"));

export const messageSlice = createSlice({
  name: "message",

  initialState: {
    directMessages: localDMs || [],
    groupMessages: [],
    lastMessage: localLMs || [],
  },

  reducers: {
    newDirectMessage: (state, action) => {
      let senderjid = action.payload.from;
      let message = action.payload.body;
      let stamp = action.payload.stamp;
      let isClientMessage = action.payload.isClientMessage;
      let itemIndex;
      let prevMessages;

      if (state.directMessages.some((msg) => msg[senderjid])) {
        state.directMessages.forEach((dm, index) => {
          if (dm[senderjid]) {
            prevMessages = dm[senderjid];
            prevMessages.unshift({
              chat: message,
              isClientMessage: isClientMessage === true ? true : false,
              stamp,
            });
            itemIndex = index;
          }
        });

        state.directMessages[itemIndex][senderjid] = prevMessages;
        localStorage.setItem(
          "directMessages",
          JSON.stringify(state.directMessages)
        );
      } else {
        state.directMessages = [
          {
            [senderjid]: [
              {
                chat: message,
                isClientMessage: isClientMessage === true ? true : false,
                stamp,
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
  },
});

export const {
  newDirectMessage,
  newGroupMessage,
  updateLastMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
