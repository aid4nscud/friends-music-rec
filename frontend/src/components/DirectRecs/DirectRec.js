import React from "react";
import "./DirectRec.css";

export const DirectRec = (props) => {
  return (
    <div className="direct-rec">
      <div>content</div>
      <iframe
        className="loading-spinner"
        style={{
          margin: "auto",
          borderRadius: "1rem",
          borderStyle: "hidden",
          borderColor: "white",
        }}
        onLoad={() => {
          const arr = document.getElementsByClassName("loading-spinner");
          for (let i = 0; i < arr.length; i++) {
            arr[i].style.backgroundImage = "none";
          }
        }}
        width="100%"
        height="500px"
        src={
          "https://open.spotify.com/embed/track/" + props.recInfo.uri.substr(14)
        }
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      />
      <h2 style={{ color: "black" }}>{" from " + props.recInfo.user}</h2>
    </div>
  );
};
