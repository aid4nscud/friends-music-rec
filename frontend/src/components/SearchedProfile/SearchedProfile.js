import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCookie } from "../../utils/auth";
import "./SearchedProfile.css";
import { SearchedUserRec } from "./SearchedUserRec";

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
            <h1>{"Welcome to " + user + "'s profile!"}</h1>
            {user !== getCookie("user") && (
              <button
                className="searched-user-follow-button"
                onClick={() => {
                  if (followed === true) {
                    setFollowed(false);
                    setFollowers(followers - 1);
                    unfollow(user);
                  }
                  if (followed === false) {
                    setFollowed(true);
                    setFollowers(followers + 1);
                    follow(user);
                  }
                }}
              >
                {followed === true ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <ul className="searched-user-social-info">
            <li style={{ borderRightStyle: "solid", borderColor: "black" }}>
              {followers === null ? "Followers: 0" : "Followers: " + followers}
            </li>
            <li style={{ borderRightStyle: "solid", borderColor: "black" }}>
              {following === null ? "Following: 0" : "Following: " + following}
            </li>
            <li>
              {userRecs === null ? "Recs: 0" : "Recs: " + userRecs.length}
            </li>
          </ul>
        </div>
      )}

      {userRecs !== null ? (
        <h2>Song Recommendations</h2>
      ) : (
        <h2>{user + " hasn't made any recommendations yet :("}</h2>
      )}

      {userRecs !== null && (
        <div className="searched-profile-recs">
          {userRecs.map((rec) => {
            return (
              <SearchedUserRec
                recID = {rec._id}
                likeRec={likeRec}
                unlikeRec={unlikeRec}
                date={rec.date}
                likes={rec.likes}
                uri={rec.uri}
                song={rec.song}
                artist={rec.artist}
                images={rec.images}
                liked={rec.liked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
