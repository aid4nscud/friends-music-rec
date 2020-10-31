import React, { useState } from "react";
import "./Recommendations.css";
import { Rec } from "./Rec";

export const Recommendations = (props) => {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <h3> Listen to recommenadations!</h3>
      {props.recs !== null && 
        <Rec
          imageURL={props.recs[index].imageURL}
          song={props.recs[index].song}
          artist={props.recs[index].artist}
        ></Rec>
      }
      <button
        onClick={() => {
          const currIndex = index == props.recs.length - 1 ? 0 : index + 1;

          setIndex(currIndex);
        }}
      >
        Next Rec
      </button>
      <div>
        {
          <button
            onClick={() => {
              setIndex(0);
            }}
          >
            {" "}
            Refresh
          </button>
        }
      </div>
    </div>
  );
};
