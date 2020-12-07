import React, { useState, useEffect } from "react";
import "./Discover.css";
import { DiscoverRec } from "../DiscoverRec/DiscoverRec";
import { getCookie } from "../../utils/auth";

export const Discover = (props) => {
  const [index, setIndex] = useState(0);
  const [recs, setRecs] = useState(null);
  const [followButton, setFollowButton] = useState("Follow");
  const [moreInfo, setMoreInfo] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const data = {'user':getCookie("user")};
    if (data['user'] !== null) {
      const url = "/api/get_discover_recs"
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            setRecs(parsedJSON["recs"]);
          }
        });
    } 
  }, []);

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
          setFollowButton("Following");
        }
      });
  };

  const nextRec = () => {
    {
      const currIndex = index == recs.length - 1 ? 0 : index + 1;

      setIndex(currIndex);
      setMoreInfo(false);
      setFollowButton("Follow");
      setLiked(false)
    }
  };

  function likeRec(recToLike) {
    const userLiking = getCookie("user");

    const data = {
      recToLike: recToLike,
      userLiking: userLiking,
    };
    fetch("/api/like_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (!parsed.success) {
          return alert('error')
    
        }
        setLiked(true)

      });
  }



  return (
    <div className="discover">
      <h1>Explore Recommendations!</h1>
      {recs === null ? (
        <h1>No recs rn G</h1>
      ) : (
        <div>
          <DiscoverRec
          liked = {liked}
          setLiked={setLiked}
          likes={recs[index].likes}
          id={recs[index]._id}
          user={recs[index].user}
          spotifyToken={props.spotifyToken}
          setSpotifyToken={props.setSpotifyToken}
          images={recs[index].images}
          song={recs[index].song}
          artist={recs[index].artist}
          uri={recs[index].uri}
          like={likeRec}
          nextRec={nextRec}
          follow={follow}
          followButton={followButton}
          moreInfo={moreInfo}
          setMoreInfo={setMoreInfo}
          />
        </div>
      )}
    </div>
  );
};
