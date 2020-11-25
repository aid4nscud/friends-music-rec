import React from "react";

export const FeedRec = (props) => {
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div className="feed-rec">
      <iframe
        src={url}
        width="500"
        height="500"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <div>
        <h3 className="rec-desc">
          Recommended to you by{" "}
          <span className="span-recommender">{props.user}</span>
        </h3>
      </div>

      <button onClick={props.nextRec}>Next</button>
    </div>
  );
};
