import React from "react";
import ReactDOM from "react-dom";
export default function DmPortal({ id, children }) {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return ReactDOM.createPortal(children, document.querySelector(`#${id}`));
}
