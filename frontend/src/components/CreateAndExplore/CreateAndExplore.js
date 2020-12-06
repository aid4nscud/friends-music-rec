import { useState, useEffect } from "react";
import { getCookie } from "../../utils/auth";

import React from "react";
import { SearchRec } from "../SearchRec/SearchRec";
import "./CreateAndExplore.css";
import { Discover } from "../Discover/Discover";

export const CreateAndExplore = (props) => {
  const [render, setRender] = useState(0);
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
    <div className="create-explore">
      <div className="discover">
        {recs === null ? (
          <h1>No recs rn G</h1>
        ) : (
          <div>
            <h1>Explore Anonymous Recommendations</h1>
            <Discover
            recs = {recs}
            nextRec={nextRec}
            follow={follow}
            liked={liked}
            setLiked={setLiked}
            moreInfo={moreInfo}
            setMoreInfo={setMoreInfo}
            followButton={followButton}
              spotifyToken={props.spotifyToken}
              setSpotifyToken={props.setSpotifyToken}
              likeRec={likeRec}
              index={index}
            />
          </div>
        )}
      </div>

      <SearchRec
        spotifyToken={props.spotifyToken}
        setSpotifyToken={props.setSpotifyToken}
      />
    </div>
  );
};
