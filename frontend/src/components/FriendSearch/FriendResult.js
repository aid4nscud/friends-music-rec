import React, { useEffect, useState } from "react";
import "./FriendResult.css";

export const FriendResult = (props) => {
  const [added, setAdded] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  useEffect(() => {
    if (added === true) {
      setBackgroundColor("#f70c766e");
    } else {
      setBackgroundColor("white");
    }
  });
  return (
    <div
      className="friend-result"
      style={{
        background: backgroundColor,
      }}
    >
      <h2 className="friend-result-name">{props.friend}</h2>

      {added === false && (
        <button
          style={{
            padding: "0.5rem",
          }}
          onClick={() => {
            setAdded(true);
            props.addFriend(props.friend);
          }}
        >
          Add
        </button>
      )}
      {added === true && (
        <button
          style={{
            padding: "1rem",
          }}
          onClick={() => {
            setAdded(false);
            props.deleteFriend(props.friend);
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
};
