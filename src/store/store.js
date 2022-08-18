import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slices/messageSlice";
import contactsReducer from "../slices/contactsSlice";
import authReducer from "../slices/authSlice";
import groupSetupSlice from "../slices/groupSetupSlice";
import floatingButtonSlice from "../slices/floatingButtonSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer,
    contacts: contactsReducer,
    groupSetup: groupSetupSlice,
    floatingButton: floatingButtonSlice,
  },
});
