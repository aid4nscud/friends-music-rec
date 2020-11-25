import React, { useState, useEffect } from "react";
import "./Discover.css";
import { DiscoverRec } from "../DiscoverRec/DiscoverRec";
import { getCookie } from "../../utils/auth";

export const Discover = (props) => {
  const [index, setIndex] = useState(0);
  const [recs, setRecs] = useState(null);
  const [followButton, setFollowButton] = useState("Follow");

  const follow = (userToFollow) => {
    const userFollowing = getCookie("user");

    const data = {
      userToFollow: userToFollow,
      userFollowing: userFollowing,
    };
    fetch("/api/follow_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.success) {
          alert("sucessfully followed user");
          setFollowButton("Following");
        }
      });
  };

  useEffect(() => {
    const user = getCookie("user");
    if (user !== null) {
      const url = "/get_discover_recs/" + user;
      fetch(url)
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            setRecs(parsedJSON["recs"]);
          }
        });
    } else {
      const url = "/get_feed_recs/" + getCookie("user");
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
    <div className="discover">
      {recs === null ? (
        <h1>No recs rn G</h1>
      ) : (
        <div>
          <h1>Listen to Random Recommendations</h1>
           <DiscoverRec
          user={recs[index].user}
          spotifyToken={props.spotifyToken}
          setSpotifyToken={props.setSpotifyToken}
          images={recs[index].images}
          song={recs[index].song}
          artist={recs[index].artist}
          uri={recs[index].uri}
          nextRec={nextRec}
          follow={follow}
          followButton={followButton}
        />
        </div>
       
      )}
    </div>
  );
};
