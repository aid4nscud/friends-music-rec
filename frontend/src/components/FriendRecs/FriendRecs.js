import React from "react";
import { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import { FeedRec } from "../FeedRec/FeedRec";
import { SearchUser } from "../SearchUser/SearchUser";

export const FriendRecs = (props) => {
  const [recs, setRecs] = useState(null);
  const [index, setIndex] = useState(0);
  const [followButton, setFollowButton] = useState("Following");
  const [render, setRender] = useState(0);

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
          } else {
            setRecs(false);
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
          } else {
            setRecs(false);
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
    setIndex(0);
    setRender(render + 1);
    setFollowButton("Following");
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
    <div>
      {(recs !== null && recs.length > 0)  ? (
        <FeedRec
          render={render}
          setRender={setRender}
          unlikeRec={unlikeRec}
          recInfo={recs[index]}
          likeRec={likeRec}
          nextRec={nextRec}
          unfollow={unfollow}
          follow={follow}
          followButton={followButton}
        />
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
