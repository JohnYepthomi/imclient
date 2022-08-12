import { createSlice } from "@reduxjs/toolkit";

export const floatingButtonSlice = createSlice({
  name: "floatingButton",

  initialState: {
    currentView: "chats",
  },

  reducers: {
    setView: (state, action) => {
      state.currentView = action.payload;
    },
  },
});

export const { setView } = floatingButtonSlice.actions;
export default floatingButtonSlice.reducer;
