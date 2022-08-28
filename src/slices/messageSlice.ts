import { createSlice } from "@reduxjs/toolkit";
import { ChatPayload, GroupChatPayload } from "../services/service.types";


let localDMs = JSON.parse(localStorage.getItem("directMessages")!);
let localLMs = JSON.parse(localStorage.getItem("lastMessage")!);

type GM = { [groupName: string]: [GroupChatPayload] }[];
type DM = { [userjid: string]: [ChatPayload] }[];
type LM = { [jid: string]: string }[];
type LGM = { [gid: string]: [] }[];
type GP = { [gid: string]: [] }[];

type INITIAL_STATE = {
  directMessages: DM;
  groupMessages: GM;
  lastMessage: LM;
  lastGroupMessage: LGM;
  groupParticipants: GP;
  tempParticipants: [];
};

const initialState: INITIAL_STATE = {
  directMessages: localDMs || [],
  groupMessages: [],
  lastMessage: localLMs || [],
  lastGroupMessage: [],
  groupParticipants: [],
  tempParticipants: [],
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    /*---------Direct Messages Reducers---------*/
    newDirectMessage: (state, action: {payload: ChatPayload}) => {
      let { id, from, timestamp, sender, delivered, sent, body } = action.payload;
      let recordExist = false;

      state.directMessages.forEach((useritem) => {
        if (useritem[sender]) recordExist = true;
      });

      if (recordExist) {
        state.directMessages.forEach((records, index) => {
          if (records[sender]) {
            let prevState = records[sender]!;
            prevState.unshift({
              id,
              from,
              body,
              sender,
              timestamp,
              delivered,
              sent,
            });
            state.directMessages[index]![sender] = prevState;
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
      }

      localStorage.setItem(
        "directMessages",
        JSON.stringify(state.directMessages)
      );
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

    updateDeliveredMessage: (state, action) => {
      let messageId = action.payload.id;

      state.directMessages.forEach((user, firstIndex: number) => {
        Object.values(user).forEach((usermessages: [ChatPayload]) => {
          usermessages.forEach((message: ChatPayload) => {
            if (message.from === "self" && message.id === messageId) {
              state.directMessages[firstIndex]![message.sender]!.forEach(
                (m: ChatPayload, mIndex: number) => {
                  if (m.id === messageId) {
                    state.directMessages[firstIndex]![message.sender]![
                      mIndex
                    ]!.delivered = true;
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
      state.directMessages.forEach((users, outerindex: number) => {
        Object.values(users).forEach((usermessages, midIndex) => {
          usermessages.forEach((message: ChatPayload) => {
            if (message.id === messageId)
              state.directMessages[outerindex]![message.sender]![
                midIndex
              ]!.sent = true;
          });
        });
      });
    },

    updateReaction: (state, action) => {
      let {reactionId, reactedby, emoji, sender} = action.payload;

      state.directMessages.forEach((userentry, index) => {
        userentry[sender] && userentry[sender].forEach((message, messageIndex) => {
          let idMatched = message.id === reactionId;
          let hasReaction = message.hasOwnProperty('reactions') && (message.reactions!.length > 0);
          let emojiExist = false;

          if(!idMatched)
            return;

          if(!hasReaction){
            state.directMessages[index][sender][messageIndex]
              .reactions = [{emoji, reactors: [reactedby]}];
            return;
          }

          emojiExist = message.reactions!.some((r) => r.emoji === emoji);

          if(emojiExist){
            state.directMessages[index][sender][messageIndex]
            .reactions!
            .forEach((reaction, reactionIndex)=>{
              let numReactors = reaction.reactors.length;

              if(reaction.emoji === emoji)
                return;

              reaction.reactors.forEach((reactor, reactorIndex) => {
                let reactorMatch  = reactor === reactedby;

                if(reactorMatch){
                  if(numReactors && numReactors > 1){
                    state.directMessages[index][sender][messageIndex]
                      .reactions![reactionIndex]
                      .reactors.splice(reactorIndex, 1);
                  }else{
                    state.directMessages[index][sender][messageIndex]
                      .reactions!
                      .splice(reactorIndex, 1);
                  }
                }
              });
            });
          }else{
            state.directMessages[index][sender][messageIndex]
              .reactions!
              .forEach((reaction, reactionIndex)=>{
                let numReactors = reaction.reactors.length;

                reaction.reactors.forEach((reactor, reactorIndex) => {
                  let reactorMatch = reactor === reactedby;

                  if(reactorMatch){
                    if(numReactors && numReactors > 1){
                      state.directMessages[index][sender][messageIndex]
                        .reactions![reactionIndex]
                        .reactors.splice(reactorIndex, 1);
                    }else{
                      state.directMessages[index][sender][messageIndex]
                        .reactions!
                        .splice(reactorIndex, 1);
                    }
                  }

                  state.directMessages[index][sender][messageIndex]
                    .reactions!
                    .push({emoji, reactors: [reactedby]})
                })
              });
          }
        });
      });

      localStorage
        .setItem("directMessages",JSON.stringify(state.directMessages));
    },

    removeReaction: (state, action) => {
      let reactionId = action.payload.reactionId;
      let sender = action.payload.jid;
      let removedby = action.payload.removedby;

      state.directMessages.forEach((user, usersIdx: number) => {
        Object.values(user).forEach((messages: [ChatPayload]) => {
          messages.forEach((message: ChatPayload, messageidx) => {
            if (message.id === reactionId) {
              message.reactions &&
                message.reactions.forEach((reaction, reactionidx) => {
                  reaction.reactors.forEach((reactor) => {
                    if (removedby === reactor) {
                      state.directMessages[usersIdx]![sender]![
                        messageidx
                      ]!.reactions?.splice(reactionidx, 1);
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

    /*---------Group Messages Reducers---------*/

    newGroupMessage: (state, action) => {
      let { groupName } = action.payload;
      let groupExists = state.groupMessages.some((record) => record[groupName]);

      if (groupExists) {
        state.groupMessages.forEach((record, index) => {
          if (record[groupName]) {
            let prevmsgs: [GroupChatPayload] = record[groupName]!;
            prevmsgs.unshift(action.payload);
            state.groupMessages[index]![groupName] = prevmsgs;
          }
        });
      } else {
        state.groupMessages.push({
          [groupName]: [action.payload],
        });
      }
    },

    setGroupParticipants: (state, action) => {
      let participants: [] = action.payload.participants;
      let groupName: string = action.payload.groupName!;

      if (state.groupParticipants.some((p) => p[groupName])) {
        state.groupParticipants.map((p) => {
          if (p[groupName]) {
            return [...p[groupName]!, participants];
          }

          return;
        });
      } else {
        state.groupParticipants.push({ [groupName]: participants });
      }
    },

    setTempParticipants: (state, action) => {
      state.tempParticipants = action.payload;
    },

    updateGroupSentMessage: (state, action) => {
      let groupName = action.payload.groupName;
      let msgId = action.payload.messageId;

      state.groupMessages.forEach((record) => {
        if (record[groupName]) {
          record[groupName]!.forEach((msg, index) => {
            if (msg.id == msgId) {
              record[groupName]![index]!.sent = true;
            }
          });
        }
      });
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
  },
});

export const {
  newDirectMessage,
  updateLastMessage,
  updateDeliveredMessage,
  updateSentMessage,
  updateReaction,
  removeReaction,
  newGroupMessage,
  updateGroupSentMessage,
  setGroupParticipants,
  setTempParticipants,
  updateLastGroupMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
