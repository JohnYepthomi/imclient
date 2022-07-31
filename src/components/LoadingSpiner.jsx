import React from "react";
import "../styles/loadingspinner.css";

export default function LoadingSpiner({ submitted }) {
  return submitted ? (
    <div style={{ visibility: "visible", marginTop: "30px" }}>
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  ) : (
    <div style={{ visibility: "hidden", marginTop: "30px" }}>
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
