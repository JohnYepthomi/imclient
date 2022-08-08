import React from "react";

export default function Menu({ className, options }) {
  return (
    <div className={"menu-" + className}>
      {options &&
        options.map((option) => {
          return <div>{option}</div>;
        })}
    </div>
  );
}
