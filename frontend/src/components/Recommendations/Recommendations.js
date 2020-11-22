import React, { useState } from "react";
import "./Recommendations.css";
import { Rec } from "../Rec/Rec";

export const Recommendations = (props) => {
  const [index, setIndex] = useState(0);

  const nextRec = () => {
    {
      const currIndex = index == props.recs.length - 1 ? 0 : index + 1;

      setIndex(currIndex);
    }
  }
  return (
    <div>
      <h3> Listen to recommenadations!</h3>
      {props.recs !== null && (
        <Rec
        spotifyToken={props.spotifyToken}
        setSpotifyToken={props.setSpotifyToken}
          images={props.recs[index].images}
          song={props.recs[index].song}
          artist={props.recs[index].artist}
          uri={props.recs[index].uri}
          nextRec={nextRec}
        />
      )}
    
    </div>
  );
};
