import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../features/messageSlice";
import contactsReducer from "../features/contactsSlice";
import authReducer from "../features/authSlice";

export default configureStore({
  reducer: {
    messages: messageReducer,
    auth: authReducer,
    contacts: contactsReducer,
  },
});
