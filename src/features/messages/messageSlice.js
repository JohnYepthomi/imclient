import { createSlice, createReducer } from '@reduxjs/toolkit';

let localAuthState = JSON.parse(localStorage.getItem('directMessages'));

export const messageSlice = createSlice({
  name: 'message',

  initialState: {
    directMessages: localAuthState || [],
    groupMessages: [],
    lastMessage: []
  },

  reducers: {
    newDirectMessage: (state, action) => {
      let senderjid = action.payload.from;
      let message = action.payload.body;
      let stamp = action.payload.stamp;
      let isClientMessage = action.payload.isClientMessage;
      let itemIndex;
      let prevMessages;

      if(state.directMessages.some(msg => msg[senderjid])){
        state.directMessages.forEach((dm, index)=>{
          if(dm[senderjid]){
            prevMessages = dm[senderjid];
            prevMessages.unshift({chat: message, isClientMessage: (isClientMessage === true) ? true : false, stamp}, );
            itemIndex = index;
          }
        });
        
        state.directMessages[itemIndex][senderjid] = prevMessages;
        localStorage.setItem('directMessages', JSON.stringify(state.directMessages));
      }else{
        state.directMessages = [{[senderjid]: [{chat: message, isClientMessage: (isClientMessage === true) ? true : false, stamp}]}, ...state.directMessages];
        localStorage.setItem('directMessages', JSON.stringify(state.directMessages));
      }
    },

    newGroupMessage: (state, action) => {
      let senderjid = action.payload.from;
      let messagebody = action.payload.body;

      if(state.groupMessages[senderjid]){
        let prevmsgs = state.groupMessages[senderjid];
        prevmsgs && prevmsgs.push({
          messagebody
        });
  
        state.groupMessages[senderjid] = prevmsgs;
      }else{
        state.groupMessages[senderjid] = [{
          messagebody
        }];
      }
    },

    updateLastMessage: (state, action) =>{
      if(state.lastMessage.length === 0){
        state.lastMessage.push({[action.payload.from]: action.payload});
      }else{
        
        const newLastMessage = state.lastMessage.filter(message => Object.values(message)[0].from !== action.payload.from);
          newLastMessage.push({[action.payload.from]: action.payload});
          state.lastMessage = newLastMessage;  
      }
    }
  }
})

export const { newDirectMessage, newGroupMessage, updateLastMessage } = messageSlice.actions;
export default messageSlice.reducer;