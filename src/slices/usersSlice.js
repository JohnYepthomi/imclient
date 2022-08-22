import { createSlice } from "@reduxjs/toolkit";
import StorageLocal from "../utils/storageLocal.js";

// let localUserInfo = StorageLocal.parseItem("userInfo");

export const usersSlice = createSlice({
  name: "users",

  initialState: {
    users: [],
  },

  reducers: {
    addUsers: (state, action) => {
      let jid = action.payload.jid;
      let newUserData = action.payload;

      state.users.forEach((user) => {
        if (!user[jid]) {
          state.users.push(newUserData);
        }
      });
    },
    removeUsers: (state, action) => {
      let jid = action.payload.jid;

      state.users.forEach((user, index) => {
        if (user[jid]) {
          state.users.splice(index, 1);
        }
      });
    },
    updateUserPresence: (state, action) => {
      let jid = action.payload.jid;
      let presence = action.payload.presence;

      state.users.forEach((user, index) => {
        if (user[jid]) {
          state.users[index][jid].presence = presence;
        }
      });
    },
  },
});

export const { saveUserInfo, updateUserLogin } = usersSlice.actions;
export default usersSlice.reducer;
