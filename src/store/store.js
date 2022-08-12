import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../features/messageSlice";
import contactsReducer from "../features/contactsSlice";
import authReducer from "../features/authSlice";
import groupSetupSlice from "../features/groupSetupSlice";
import floatingButtonSlice from "../features/floatingButtonSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer,
    contacts: contactsReducer,
    groupSetup: groupSetupSlice,
    floatingButton: floatingButtonSlice,
  },
});
