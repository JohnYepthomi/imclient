import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { enableEditMode } from "../features/groupSetupSlice";
import { setView } from "../features/floatingButtonSlice";

export default function Menu({ className, options }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    // update 'loggedIn' state and 'loggedOut' out state in redux
    // navigate to home
  }

  function handleNewGroup() {
    dispatch(enableEditMode());
    dispatch(setView("contact-selection"));
    navigate("/contacts");
  }

  return (
    <div className={"menu-" + className}>
      {options &&
        options.map((option) => {
          if (option === "new group") {
            return <div onClick={handleNewGroup}>{option}</div>;
          } else if (option === "logout") {
            return <div onClick={handleLogout}>{option}</div>;
          }
        })}
    </div>
  );
}
