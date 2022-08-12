import { createSlice } from "@reduxjs/toolkit";

export const participantsSlice = createSlice({
  name: "paticipants",

  initialState: {
    selectedParticipants: [],
    selection: false,
    selectionStarted: false,
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
    setSelectionStart: (state, payload) => {
      state.selectionStarted = true;
    },
    setSelectionEnd: (state, payload) => {
      state.selectionStarted = false;
    },
  },
});

export const {
  updateSelection,
  enableSelection,
  disableSelection,
  setSelectionStart,
  setSelectionEnd,
} = participantsSlice.actions;
export default participantsSlice.reducer;
