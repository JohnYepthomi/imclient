import React from "react";
import { Link } from "react-router-dom";

export default function Menu({ className, options }) {
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
          } else {
            return <div>{option}</div>;
          }
        })}
    </div>
  );
}
