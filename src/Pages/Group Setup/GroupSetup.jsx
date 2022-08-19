import React from "react";
import container from "../../DI/di-container";
import base64encoder from "../../utils/base64encoder";
import { motion } from "framer-motion/dist/framer-motion";
import { setGroupCreated } from "../../slices/groupSetupSlice";
import { Link, useNavigate } from "react-router-dom";
import { setRequestSubmitted } from "../../slices/groupSetupSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
  setGroupParticipants,
  setTempParticipants,
} from "../../slices/messageSlice";
import { setPendingSetups } from "../../slices/groupSetupSlice";
import "./GroupSetup.css";

export default function GroupSetup() {
  const groupNameRef = useRef();
  const fileInputRef = useRef();
  const [groupName, setGroupName] = useState();
  const [img, setImg] = useState(false);
  const [base64Img, setBase65Img] = useState();
  const dispatch = useDispatch();
  const { StanzaService } = container;
  const tempParticipants = useSelector(
    (state) => state.messages.tempParticipants
  );
  const hasGroupRequestSubmitted = useSelector(
    (state) => state.groupSetup.requestSubmitted
  );
  const isGroupCreated = useSelector((state) => state.groupSetup.groupCreated);
  const nickName = `bitplayer${generateId(3)}`;
  const navigate = useNavigate();

  function handleGetImageInfo() {
    try {
      const imageUrl = URL.createObjectURL(fileInputRef.current.files[0]);
      const imageFilename = fileInputRef.current.name;
      const base64Image = base64encoder(fileInputRef.current.files[0]);
      const imageType = "";

      if (imageFilename.includes("png")) imageType = "png";
      else if (imageFilename.includes("jpg") || imageFilename.includes("jpeg"))
        imageType = "jpg";

      setImg(imageUrl);
      // setBase65Img(base64Image);
    } catch (e) {
      console.log(e);
    }
  }

  function handleTriggerFileSelect() {
    fileInputRef.current.click();
  }

  function generateId(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  function createNewRoom() {
    dispatch(
      setGroupParticipants({ groupName, participants: tempParticipants })
    );
    dispatch(setTempParticipants([]));
    StanzaService.xepList().requestNewRoom(groupName, nickName);
  }

  useEffect(() => {
    if (groupName === "" || groupName === null || groupName === undefined) {
      console.log("Enter a room name.");
      dispatch(setRequestSubmitted(false)); /* used by Floating Button */
      return;
    } else if (hasGroupRequestSubmitted) {
      dispatch(setPendingSetups({ groupName, img }));
      createNewRoom();
    }

    return () => {
      dispatch(setRequestSubmitted(false)); /* used by Floating Button */
    };
  }, [hasGroupRequestSubmitted]);

  useEffect(() => {
    if (isGroupCreated)
      navigate(
        `/conversation/?type=group&gid=${groupName}&nick=${nickName}&complete=false`
      );
    return () => {
      dispatch(setGroupCreated(false));
    };
  }, [isGroupCreated]);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
      }}
    >
      <div className="groupsetup-header">
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
        </Link>
        <div className="groupsetup-text">
          <div className="title">New Group</div>
          <div className="subject">Add subject</div>
        </div>
      </div>

      {!hasGroupRequestSubmitted && (
        <div className="group-setup-container">
          <div className="new-group-name">
            {img && (
              <img
                src={img}
                alt="group profile"
                id="group-avatar"
                onClick={handleTriggerFileSelect}
              />
            )}
            {!img && (
              <div className="add-image-icon" onClick={handleTriggerFileSelect}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="white"
                  class="bi bi-camera-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                </svg>
              </div>
            )}
            <input
              type="file"
              name=""
              id="fileId"
              onChange={handleGetImageInfo}
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".png,.jpg,.jpeg"
            />
            <input
              type="text"
              className="name"
              ref={groupNameRef}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
              value={groupName}
              placeholder="Type group subject here..."
            />
          </div>

          <div className="participants-container">
            <div className="header">Paticipants: {tempParticipants.length}</div>
            <div className="participants-list">
              {tempParticipants &&
                tempParticipants.map((participant, index) => {
                  return (
                    <div className="participant-details" key={index}>
                      <div className="profile-image">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="gray"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path
                            fillRule="evenodd"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                          />
                        </svg>
                      </div>
                      <div className="participant-name">
                        {participant.split("@")[0]}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {hasGroupRequestSubmitted && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "white",
          }}
        >
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <small>Please wait</small>
          <small>Creating New Group</small>
        </div>
      )}
    </motion.div>
  );
}
