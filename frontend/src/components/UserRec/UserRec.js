import React from "react";
import "./UserRec.css";

export const UserRec = (props) => {
  return (
    <div className="user-rec">
      <p>{props.song}</p>
      <img alt={props.song} src={props.images[2]["url"]} />
      <p>{props.artist}</p>
    </div>
  );
};
