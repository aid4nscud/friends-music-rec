import React from "react";



export const Rec = (props) => {
  
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div>
      <iframe
        src={url}
        width="500"
        height="500"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>

      <button onClick={props.nextRec}>Next</button>
    </div>
  );
};
