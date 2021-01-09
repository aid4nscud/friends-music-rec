import React from "react";
import { useState } from "react";
import { getCookie } from "../../utils/auth";
import { FeedRec } from "../FeedRec/FeedRec";
import { SearchUser } from "../SearchUser/SearchUser";
import { DirectRecs } from "../DirectRecs/DirectRecs";
import "./FriendRecs.css";

export const FriendRecs = (props) => {
  const [index, setIndex] = useState(0);
  const [followButton, setFollowButton] = useState("Following");
  const [render, setRender] = useState(0);
  const [directRecsTog, setDirectRecsTog] = useState(false);

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
    return index === props.feedRecs.length - 1 ? nextErr() : nextSuccess();
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
      <div>
        {props.directRecs !== null && props.directRecs.length > 0 && (
          <div
            className="friend-recs-toggle"
            onClick={() => {
              directRecsTog === true
                ? setDirectRecsTog(false)
                : setDirectRecsTog(true);
            }}
          >
            {directRecsTog === false ? (
              <div className="direct-recommendations-tog">
                <h3 className="tog-label">Direct</h3>
                <div className="direct-recs-num">
                  <b style={{ alignSelf: "center" }}>
                    {props.directRecs.length}
                  </b>
                </div>
              </div>
            ) : (
              <div className="friend-recommendations-tog">
                <h3 className="tog-label">Friend Recs</h3>
              </div>
            )}
          </div>
        )}
        {directRecsTog === false ? (
          <div>
            {props.feedRecs === null ||
              (props.feedRecs.length === 0 && (
                <div style={{ marginTop: "3rem" }}>
                  <h2 style={{ color: "black" }}>
                    You aren't following anyone yet, search profiles or explore!
                  </h2>
                  <SearchUser />
                </div>
              ))}
            {props.feedRecs !== null && props.feedRecs.length > 1 && (
              <FeedRec
                render={render}
                setRender={setRender}
                unlikeRec={unlikeRec}
                recInfo={props.feedRecs[index]}
                likeRec={likeRec}
                nextRec={nextRec}
                unfollow={unfollow}
                follow={follow}
                followButton={followButton}
              />
            )}

            {props.feedRecs !== null && props.feedRecs.length === 1 && (
              <FeedRec
                render={render}
                setRender={setRender}
                unlikeRec={unlikeRec}
                recInfo={props.feedRecs[index]}
                likeRec={likeRec}
                unfollow={unfollow}
                follow={follow}
                followButton={followButton}
              />
            )}
          </div>
        ) : (
          <DirectRecs recs={props.directRecs} />
        )}
      </div>
    </div>
  );
};
