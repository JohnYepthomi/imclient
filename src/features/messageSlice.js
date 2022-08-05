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
      let reactedby = action.payload.reactedby; //'reactionId' is the message ID

      state.directMessages.forEach((users, usersIdx) => {
        if (users[jid]) {
          users[jid].forEach((msg, msgsIdx) => {
            if (msg.id === reactionId) {
              //check if {reactions: []} property exists
              if(state.directMessages[usersIdx][jid][msgsIdx].reactions){
                /* Get the previous reaction state and mutate it with new values */
                let prevReactions = state.directMessages[usersIdx][jid][msgsIdx].reactions;
                let found = false;

                if(!prevReactions.some((reaction, reactionidx) => reaction.emoji === emoji)){
                  prevReactions.push({
                    emoji,
                    count: 1,
                    reactors: [reactedby]
                  });

                  state.directMessages[usersIdx][jid][msgsIdx].reactions = prevReactions;
                }else if(prevReactions.some(reaction => reaction.emoji === emoji)){
                  prevReactions.forEach((reaction, reactionidx) => {
                    if(reaction.emoji === emoji){

                      if(!reaction.reactors.some(reactor => reactor === reactedby)){
                        prevReactions[reactionidx].reactors.push(reactedby);
                        prevReactions[reactionidx].count += 1;
                      }
                    }
                  });

                  state.directMessages[usersIdx][jid][msgsIdx].reactions = prevReactions;
                }
  
              }else{
                //create and update the new reaction property
                state.directMessages[usersIdx][jid][msgsIdx].reactions = [{
                  emoji,
                  count: 1,
                  reactors: [reactedby]
                }];
              }
            }
          });
        }
      });
    },

    removeReaction: (state, action) => {
      let reactionId = action.payload.reactionId;
      let removedby = action.payload.removedby;

      state.directMessages.forEach((user, usersIdx) => {
        Object.values(user).forEach((messages) => {
          messages.forEach((message, messageidx) => {
            if (message.id === reactionId){
              let jid = message.from;
              message.reactions.forEach((reaction, reactionidx) => {
                if(reaction.removedby !== 'self')
                  state.directMessages[usersIdx][jid][messageidx].reactions.splice(reactionidx, 1);
                else
                  state.directMessages[usersIdx][jid][messageidx].reactions.splice(reactionidx, 1);
              })              
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
} = messageSlice.actions;
export default messageSlice.reducer;
