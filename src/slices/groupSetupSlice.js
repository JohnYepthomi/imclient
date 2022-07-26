import { createSlice } from "@reduxjs/toolkit";

export const groupSetupSlice = createSlice({
  name: "paticipants",

  initialState: {
    contactSelected: false,
    requestSubmitted: false,
    groupCreated: false,
    pendingSetups: [],
  },

  reducers: {
    setGroupCreated: (state, action) => {
      state.groupCreated = action.payload; /* Groupsetup component */
    },
    setRequestSubmitted: (state, action) => {
      state.requestSubmitted = action.payload; /* Groupsetup component */
    },
    setContactSelected: (state, action) => {
      state.contactSelected = action.payload; /* FloatingButton component */
    },
    setPendingSetups: (state, action) => {
      state.pendingSetups.push(action.payload); /* Messages list */
    },
  },
});

export const {
  setContactSelected,
  setRequestSubmitted,
  setGroupCreated,
  setPendingSetups,
} = groupSetupSlice.actions;
export default groupSetupSlice.reducer;
