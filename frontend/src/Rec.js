import React, { useEffect } from "react";

export const Rec = (props) => {
  
  
  let uri = props.uri
  let uriCode = uri.substr(14)

  let url = "https://open.spotify.com/embed/track/" + uriCode

  // pause audio sound
  
  return (
    <div>
      <iframe src={url} width="380" height="400" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

    <button onClick={props.nextRec}>Next</button>
    </div>
  );
};

