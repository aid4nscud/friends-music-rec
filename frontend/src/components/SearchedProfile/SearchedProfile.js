import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCookie } from "../../utils/auth";
import "./SearchedProfile.css";
import { SearchedUserRec } from "./SearchedUserRec";

import { BsLightningFill } from "react-icons/bs";

export const SearchedProfile = (props) => {
  const [userRecs, setUserRecs] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [followed, setFollowed] = useState(null);

  const { user } = useParams();

  useEffect(() => {
    let query = user;
    let requestingUser = getCookie("user");

    const url = "/api/get_user_profile";

    const data = { user: query, requestingUser: requestingUser };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsedJSON) => {
        if (parsedJSON["recs"].length > 0) {
          setUserRecs(parsedJSON["recs"]);
          setFollowers(parsedJSON["num_followers"]);
          setFollowing(parsedJSON["num_following"]);
          setFollowed(parsedJSON["followed"]);
        } else if (
          parsedJSON["num_followers"] &&
          parsedJSON["recs"].length <= 0
        ) {
          setFollowers(parsedJSON["num_followers"]);
          setFollowing(parsedJSON["num_following"]);
        }
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

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
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (!parsed.success) {
          return alert("error");
        }
      });
  }

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
        if (!parsed.success) {
          alert("error");
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
        if (!parsed.success) {
          alert("error");
        }
      });
  };

  return (
    <div className="searched-profile">
      {user && (
        <div className="searched-profile-header">
          <div className="welcome-follow">
            <h1>
              Welcome to <span className="span-user">{user + "'s"}</span>{" "}
              profile
            </h1>
            {user !== getCookie("user") && (
              <div style={{ display: "inline-block" }}>
                {followed === true ? (
                  <button
                    style={{
                      backgroundColor: "#00E0C3",
                      color: "black",
                    }}
                    className="searched-user-follow-button"
                    onClick={() => {
                      unfollow(user);
                      setFollowed(false);
                      setFollowers(followers - 1);
                    }}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="searched-user-follow-button"
                    onClick={() => {
                      follow(user);
                      setFollowed(true);
                      setFollowers(followers + 1);
                    }}
                  >
                    Follow
                  </button>
                )}
              </div>
            )}
          </div>
          <div style={{ display: "inline-block", marginLeft: "3rem" }}>
            <BsLightningFill
              style={{ display: "inline-block", verticalAlign: "middle" }}
              size="2em"
              color="red"
            />{" "}
            <h3
              style={{
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              1232
            </h3>
          </div>
          <ul className="searched-user-social-info">
            <li style={{ borderRightStyle: "solid", borderColor: "white" }}>
              {followers === null ? "Followers: 0" : "Followers: " + followers}
            </li>
            <li style={{ borderRightStyle: "solid", borderColor: "white" }}>
              {following === null ? "Following: 0" : "Following: " + following}
            </li>
            <li>
              {userRecs === null ? "Recs: 0" : "Recs: " + userRecs.length}
            </li>
          </ul>
        </div>
      )}

      {userRecs !== null ? (
        <div className="searched-profile-recs-container">
          <div
            style={{
              width: "65%",
              margin: "auto",
              marginTop: "2rem",
              display: "block",
            }}
            className="searched-profile-song-recommendations"
          >
            <h2 className="searched-profile-recs-label">
              <span style={{ fontSize: "large" }} className="span-user">
                {user + "'s"}
              </span>
              Song Recommendations
            </h2>
          </div>
          <div className="searched-profile-recs">
            {userRecs.map((rec) => {
              return (
                <SearchedUserRec
                  recID={rec._id}
                  likeRec={likeRec}
                  unlikeRec={unlikeRec}
                  date={rec.date}
                  likes={rec.likes}
                  views={rec.views}
                  uri={rec.uri}
                  song={rec.song}
                  artist={rec.artist}
                  images={rec.images}
                  liked={rec.liked}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="searched-profile-recs-container">
          <div className="profile-recs">
            <h3
              style={{
                width: "auto",
                margin: "auto",
                position: "absolute",
                top: "45%",
                left: "40%",
              }}
            >
              <span style={{ fontSize: "large" }} className="span-user">
                {user}
              </span>
              hasn't recommended any songs yet :(
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
