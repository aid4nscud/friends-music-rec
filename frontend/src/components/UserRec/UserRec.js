import React from "react";
import "./UserRec.css";

export const UserRec = (props) => {

   
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div className="user-rec">
      <iframe
        src={url}
        width="250"
        height="75"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      {/* <p>{props.song}</p>
      <img alt={props.song} src={props.images[2]["url"]} />
      <p>{props.artist}</p> */}
    </div>
  );
};
