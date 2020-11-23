import React, { useState } from "react";
import "./Recommendations.css";
import { FeedRec } from "../FeedRec/FeedRec";

export const Recommendations = (props) => {
  const [index, setIndex] = useState(0);

  const nextRec = () => {
    {
      const currIndex = index == props.recs.length - 1 ? 0 : index + 1;

      setIndex(currIndex);
    }
  };
  return (
    <div className="recommendations">
      <h2> Listen to recommendations!</h2>
      {props.recs !== null && (
        <FeedRec
          user={props.recs[index].user}
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
