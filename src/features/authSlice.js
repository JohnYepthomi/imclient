import { createSlice } from "@reduxjs/toolkit";
import StorageLocal from "../utils/storageLocal.js";

// let localUserInfo = StorageLocal.parseItem("userInfo");

export const authSlice = createSlice({
  name: "authentication",

  initialState: {
    userInfo: {},
    loggedIn: false,
    loggedOut: true,
  },

  reducers: {
    saveUserInfo: (state, action) => {
      state.userInfo = action.payload;
      StorageLocal.stringifyItem("userInfo", state.userInfo);
    },
    updateUserLogin: (state, action) => {
      state.loggedIn = action.payload;
    },
  },

  // extraReducers: (builder) => {
  //   builder.addCase(authenticateUser.fulfilled, (state, action) => {
  //     //state.loggedIn = true;
  //     //state.loggedOut = !state.loggedIn;
  //   });
  // },
});

// export const authenticateUser = createAsyncThunk(
//   "authentication/authenticateUser",
//   async (arg, { getState }) => {
//     // let state = getState();
//     // diSetup(state.userInfo);
//     return true;
//   }
// );

export const { saveUserInfo, updateUserLogin } = authSlice.actions;
export default authSlice.reducer;
