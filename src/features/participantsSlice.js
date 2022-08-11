import { createSlice } from "@reduxjs/toolkit";

export const participantsSlice = createSlice({
  name: "authentication",

  initialState: {
    selectedParticipants: [],
    selection: false,
  },

  reducers: {
    updateSelection: (state, action) => {
      let newSelection = action.payload;

      state.selectedParticipants = newSelection;
    },
    enableSelection: (state, payload) => {
      state.selection = true;
    },
    disableSelection: (state, payload) => {
      state.selection = false;
    },
  },
});

export const {
  updateSelection,
  enableSelection,
  disableSelection,
} = participantsSlice.actions;
export default participantsSlice.reducer;
