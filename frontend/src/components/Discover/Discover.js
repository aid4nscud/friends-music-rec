import React, { useState, useEffect } from "react";
import "./Discover.css";
import { DiscoverRec } from "../DiscoverRec/DiscoverRec";
import { getCookie } from "../../utils/auth";

export const Discover = (props) => {
  const [index, setIndex] = useState(0);
  const [followButton, setFollowButton] = useState("Follow");
  const [render, setRender] = useState(0);
  const [liked, setLiked] = useState(null);

  const unfollow = (userToUnfollow) => {
    const userUnfollowing = getCookie("user");

    const data = {
      userToUnfollow: userToUnfollow,
      userUnfollowing: userUnfollowing,
    };
    fetch("/api/unfollow_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.success) {
          setFollowButton("Follow");
        }
      });
  };

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
    if (index !== props.recs.length - 1) {
      setIndex(index + 1);
      setFollowButton("Follow");
    } else if (index == props.recs.length - 1 && props.recs.length > 1) {
      setIndex(0);
      setFollowButton("Follow");
      setLiked(false);

      // setRender(render+1)
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
          setRender(render + 1);
        } else if (parsed.error) {
          alert("some error occurred");
        }
      });
    // setRender(render+1)
  }

  function unlikeRec(recToUnlike) {
    const userUnliking = getCookie("user");

    const data = {
      recToUnlike: recToUnlike,
      userUnliking: userUnliking,
    };

    fetch("/api/unlike_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // setRender(render+1)
  }

  return (
    <div className="discover">
      <div style={{ display: "inline-block" }} className="rec-section">
        {props.recs.length < 1 ? (
          <h1
            style={{ color: "black", marginTop: "8rem" }}
            className="container-div"
          >
            Looking for recommendations...
          </h1>
        ) : (
          <div>
            {props.recs.length > 0 && (
              <div>
                {props.recs.length > 1 ? (
                  <DiscoverRec
                    render={render}
                    setRender={setRender}
                    unlikeRec={unlikeRec}
                    recInfo={props.recs[index]}
                    spotifyToken={props.spotifyToken}
                    setSpotifyToken={props.setSpotifyToken}
                    like={likeRec}
                    nextRec={nextRec}
                    unfollow={unfollow}
                    follow={follow}
                    followButton={followButton}
                    liked={liked}
                  />
                ) : (
                  <DiscoverRec
                    unlikeRec={unlikeRec}
                    recInfo={props.recs[index]}
                    spotifyToken={props.spotifyToken}
                    setSpotifyToken={props.setSpotifyToken}
                    like={likeRec}
                    unfollow={unfollow}
                    follow={follow}
                    followButton={followButton}
                    liked={liked}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
