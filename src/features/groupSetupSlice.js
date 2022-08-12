import { createSlice } from "@reduxjs/toolkit";

export const groupSetupSlice = createSlice({
  name: "paticipants",

  initialState: {
    selectedParticipants: [],
    editMode: false,
    selectionStarted: false,
    selectionComplete: false,
  },

  reducers: {
    updateSelection: (state, action) => {
      let newSelection = action.payload;
      state.selectedParticipants = newSelection;
    },
    clearSelectedParticipants: (state, payload) => {
      state.selectedParticipants = [];
    },
    setSelectionComplete: (state, payload) => {
      state.selectionComplete = true;
    },
    enableEditMode: (state, payload) => {
      state.editMode = true;
    },
    disableEditMode: (state, payload) => {
      state.editMode = false;
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
  enableEditMode,
  disableEditMode,
  setSelectionStart,
  setSelectionEnd,
  clearSelectedParticipants,
  setSelectionComplete,
} = groupSetupSlice.actions;
export default groupSetupSlice.reducer;
