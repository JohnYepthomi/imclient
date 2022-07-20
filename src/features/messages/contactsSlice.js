import { createSlice } from '@reduxjs/toolkit'

export const userActivitySlice = createSlice({
  name: 'userActivity',
  initialState: {
    contacts: [],
    blockedList: []
  },
  reducers: {
    updateContact: (state, action) => {
      let onlineUser = action.payload.user;

      if(!state.updateContacts){
        state.contacts.push(onlineUser);
      }
    },
    updateBlockedList: (state, action) => {
      let blockedUser = action.payload.user;

      if(!state.updateContacts){
        state.contacts.push(blockedUser);
      }
    },
  }     
})

export const { updateOnlineUsers } = userActivitySlice.actions;
export default userActivitySlice.reducer;