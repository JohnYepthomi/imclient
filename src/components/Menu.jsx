import React from "react";
import { useNavigate } from "react-router-dom";

export default function Menu({ className, options }) {
  const navigate = useNavigate();

  function handleLogout() {
    // update 'loggedIn' state and 'loggedOut' out state in redux
    // navigate to home
  }

  function handleNewGroup() {
    navigate("/select_contacts");
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
