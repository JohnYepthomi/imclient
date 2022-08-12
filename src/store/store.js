import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../features/messageSlice";
import contactsReducer from "../features/contactsSlice";
import authReducer from "../features/authSlice";
import participantsSlice from "../features/participantsSlice";
import floatingButtonSlice from "../features/floatingButtonSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer,
    contacts: contactsReducer,
    participants: participantsSlice,
    floatingButton: floatingButtonSlice,
  },
});
