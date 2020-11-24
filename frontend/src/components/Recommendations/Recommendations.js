import React, { useState, useEffect } from "react";
import "./Recommendations.css";
import { FeedRec } from "../FeedRec/FeedRec";
import { getCookie } from "../../utils/auth";

export const Recommendations = (props) => {
  const [index, setIndex] = useState(0);
  const [recs, setRecs] = useState(null);

  useEffect(() => {
    const user = getCookie("user");
    if (user !== null) {
      const url = "/get_feed_recs/" + user;
      fetch(url)
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            setRecs(parsedJSON["recs"]);
          }
        });
    }
  }, []);

  const nextRec = () => {
    {
      const currIndex = index == recs.length - 1 ? 0 : index + 1;

      setIndex(currIndex);
    }
  };
  return (
    <div className="recommendations">
      <h2> Listen to recommendations!</h2>
      {recs !== null && (
        <FeedRec
          user={recs[index].user}
          spotifyToken={props.spotifyToken}
          setSpotifyToken={props.setSpotifyToken}
          images={recs[index].images}
          song={recs[index].song}
          artist={recs[index].artist}
          uri={recs[index].uri}
          nextRec={nextRec}
        />
      )}
    </div>
  );
};
