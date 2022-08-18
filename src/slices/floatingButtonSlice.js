import { createSlice } from "@reduxjs/toolkit";

export const floatingButtonSlice = createSlice({
  name: "floatingButton",

  initialState: {
    currentPage: "chats",
  },

  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = floatingButtonSlice.actions;
export default floatingButtonSlice.reducer;
