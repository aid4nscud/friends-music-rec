import React from "react";
import { useState, useEffect } from "react";
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

  const [backgroundColor1, setBackgroundColor1] = useState(
    "rgba(0, 0, 0, 0.53)"
  );
  const [color1, setColor1] = useState("black");
  const [backgroundColor2, setBackgroundColor2] = useState("white");
  const [color2, setColor2] = useState("rgba(0, 0, 0, 0.53)");

  useEffect(() => {
    if (directRecsTog === true) {
      setBackgroundColor1("white");
      setColor1("black");
      setBackgroundColor2("rgba(0, 0, 0, 0.53)");
      setColor2("white");
    } else {
      setBackgroundColor1("rgba(0, 0, 0, 0.53)");
      setColor1("white");
      setBackgroundColor2("white");
      setColor2("black");
    }
  }, [directRecsTog]);

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
          <div style={{ width: "30%", display: "flex" }}>
            <ul className="toggle-dir">
              <div
                id="tog-dir1"
                className="tog-dir"
                style={{
                  backgroundColor: backgroundColor2,

                  borderTopLeftRadius: "1.3rem",
                  borderBottomLeftRadius: "1.3rem",
                  flex: "1",

                  padding: "0.75rem",
                  borderStyle: "hidden",
                }}
                onClick={() => {
                  setDirectRecsTog(false);
                }}
              >
                <h3
                  style={{
                    color: color2,
                    alignSelf: "center",
                    height: "100%",
                    padding: "0",
                  }}
                >
                  Friends
                </h3>
              </div>
              <div
                id="tog-dir2"
                className="tog-dir"
                style={{
                  backgroundColor: backgroundColor1,

                  flex: "1",

                  padding: "0.75rem",
                  borderTopRightRadius: "1.3rem",
                  borderBottomRightRadius: "1.3rem",
                  borderStyle: "hidden",
                }}
                onClick={() => {
                  setDirectRecsTog(true);
                }}
              >
                <h3 style={{ color: color1, height: "100%", padding: "0" }}>
                  Direct
                </h3>
              </div>
            </ul>
            {directRecsTog === false && (
              <span
                style={{
                  flex: "0.1",

                  height: "1.25rem",

                  display: "inline-block",
                  verticalAlign: "middle",
                  backgroundColor: "#f70c76",
                  position: "relative",
                  bottom: "3rem",
                  right: "3rem",
                  borderRadius: "60%",
                  color: "white",
                  alignContent: "center",
                }}
              >
                {props.directRecs.length < 10 ? props.directRecs.length : "10+"}
              </span>
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
