import React from "react";
import { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import "./FeedRec.css";
import { useHistory } from "react-router-dom";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";
import { GrLinkNext } from "react-icons/gr";
import { SearchUser } from "../SearchUser/SearchUser";

export const FeedRec = (props) => {
  const [recs, setRecs] = useState(null);
  const [index, setIndex] = useState(0);
  const [followButton, setFollowButton] = useState("Following");
  const [render, setRender] = useState(0);

  const history = useHistory();

  useEffect(() => {
    const user = getCookie("user");

    if (user !== null) {
      const url = "/api/get_friend_recs";
      const data = { user: user };
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            props.setRecs(true);
            setRecs(parsedJSON["recs"]);
            props.setRecType(true);
          } 
          
        });
    } else {
      const url = "/api/get_friend_recs";
      const data = { user: getCookie("user") };
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            props.setRecs(true);
            setRecs(parsedJSON["recs"]);
            props.setRecType(true);
          }
          
        });
    }
  }, [render]);

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

  const nextErr = () => {
    setIndex(0)
    setRender(render+1)
    setFollowButton('Following')
  };
  const nextSuccess = () => {
    setIndex(index + 1);
    setRender(render + 1);
    setFollowButton("Following");
  };
  const nextRec = () => {
    return index === recs.length - 1 ? nextErr() : nextSuccess();
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
          return alert("error");
        }
      });
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
  }

  return (
    <div className="feed-rec-container">
      {recs !== null ? (
        <div>
          <div className="feed-rec">
            <div className="feed-rec-card-header">
              <div className="user-info">
                <h3 className="rec-desc">
                  Recommended by{" "}
                  <span
                    onClick={() => {
                      const url = "/app/profile/" + recs[index].user;

                      history.push(url);
                    }}
                    className="span-recommender"
                  >
                    {recs[index].user}
                  </span>
                </h3>
                {followButton === "Following" ? (
                  <button
                    style={{ backgroundColor: "white", color: "black" }}
                    className="feed-rec-follow-button"
                    onClick={() => {
                      unfollow(recs[index].user);
                    }}
                  >
                    <b>{followButton}</b>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      follow(recs[index].user);
                    }}
                    className="feed-rec-follow-button"
                  >
                    <b>{followButton}</b>
                  </button>
                )}
              </div>
              <div className="rec-info">
                <div
                  className="like-icon"
                  onClick={() => {
                    if (recs[index].liked === true) {
                      unlikeRec(recs[index]._id);

                      setRender(render + 1);
                    }
                    if (recs[index].liked === false) {
                      likeRec(recs[index]._id);

                      setRender(render + 1);
                    }
                  }}
                >
                  {recs[index].liked === true ? (
                    <LikedHeart />
                  ) : (
                    <UnlikedHeart />
                  )}
                </div>

                <h3 className="feed-likes-label">
                  {"Likes: " + recs[index].likes}
                </h3>
              </div>
            </div>
            <div className="loading-spinner">
              <iframe
                onLoad={() => {
                  const arr = document.getElementsByClassName(
                    "loading-spinner"
                  );
                  for (let i = 0; i < arr.length; i++) {
                    arr[i].style.backgroundImage = "none";
                  }
                }}
                className="feed-rec-iframe"
                src={
                  "https://open.spotify.com/embed/track/" +
                  recs[index].uri.substr(14)
                }
                width="500"
                height="500"
                frameBorder="1"
                allowtransparency="true"
                allow="encrypted-media"
              ></iframe>
            </div>

            <h3
              style={{
                width: "20%",
                margin: "2rem",
                position: "relative",
                bottom: "1rem",
              }}
            >
              {recs[index].date.substring(0, 3) +
                ", " +
                recs[index].date.substring(4)}
            </h3>
          </div>

          <div className="next-button" onClick={nextRec}>
            <GrLinkNext style={{ padding: "0.5rem" }} size="2em" />
          </div>
          
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "black" }}>
            You aren't following anyone yet, search profiles or explore!
          </h2>
          <SearchUser />
        </div>
      )}
    </div>
  );
};
