import React from "react";

export default function NewGroupMessageSetup() {
  return (
    <div className="group-setup-container">
      <div className="new-group-name">
        <label>Group Name</label>
        <input
          type="text"
          className="name"
          placeholder="enter a new group name"
        />
      </div>

      <div className="group-participants">
        <div className="participant-details">
          <div className="profile-image">Some image</div>
          <div>Samuel</div>
        </div>
      </div>
    </div>
  );
}
