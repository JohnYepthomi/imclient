import React from "react";
import { Link } from "react-router-dom";

export default function Menu({ className, options }) {
  function handleLogout() {
    // update 'loggedIn' state and 'loggedOut' out state in redux
    // navigate to home
  }

  return (
    <div className={"menu-" + className}>
      {options &&
        options.map((option) => {
          if (option === "new group") {
            return (
              <Link to="groupsetup">
                <div>{option}</div>
              </Link>
            );
          } else if (option === "logout") {
            return <div onClick={handleLogout}>{option}</div>;
          }
        })}
    </div>
  );
}
