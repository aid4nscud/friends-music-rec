import React, { useState } from "react";
import { DirectRec } from "./DirectRec";
import "./DirectRecs.css";

export const DirectRecs = (props) => {
  const [index, setIndex] = useState(0);
  return (
    <div className="direct-recs">
      <DirectRec recInfo={props.recs[index]} />
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
