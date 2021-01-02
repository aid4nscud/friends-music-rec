import React, { useState } from "react";

export const DirectRecs = (props) => {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <iframe
        height="75px"
        src={
          "https://open.spotify.com/embed/track/" +
          props.recs[index].uri.substr(14)
        }
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      />
      <h2>{" from " + props.recs[index].user}</h2>
      {props.recs.length > 1 && (
        <button
          onClick={() => {
            index === props.recs.length - 1 ? setIndex(0) : setIndex(index + 1);
          }}
          className="direct-recs-next-button"
        >
          Next
        </button>
      )}
    </div>
  );
};
