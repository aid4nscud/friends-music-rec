import React, { useEffect, useState } from "react";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";
import { GrLinkNext } from "react-icons/gr";

import { useHistory } from "react-router-dom";
import "./FeedRec.css";
import { getCookie } from "../../utils/auth";
import { HiOutlineEye } from "react-icons/hi";

export const FeedRec = (props) => {
  const [time, setTime] = useState(null);
  const [metric, setMetric] = useState("minutes");
  const [mounted, setMounted] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (mounted === false) {
      // UPDATE VIEW COUNT
      sendView(props.recInfo._id);
      setMounted(true);
    }
  }, [props.recInfo]);

  useEffect(() => {
    let currTime = Date.now() / 1000;
    let stored_time = props.recInfo.date;

    let time_dif = (currTime - stored_time) / 60;

    if (time_dif > 59) {
      setMetric("hours");
      time_dif = Math.round(time_dif / 60);
      if (time_dif > 23) {
        time_dif = Math.round(time_dif / 24);
        setMetric("days");
        if (time_dif > 7) {
          time_dif = Math.round(time_dif / 7);
          setMetric("weeks");
          if (time_dif > 3) {
            time_dif = Math.round(time_dif / 4);
            setMetric("months");
            if (time_dif > 11) {
              time_dif = Math.round(time_dif / 12);
              setMetric("years");
            } else {
              setTime(Math.round(time_dif));
            }
          } else {
            setTime(Math.round(time_dif));
          }
        } else {
          setTime(Math.round(time_dif));
        }
      } else {
        setTime(Math.round(time_dif));
      }
    } else {
      setTime(Math.round(time_dif));
    }
  }, [props.recInfo]);

  const sendView = (recId) => {
    const user = getCookie("user");

    const data = { recId: recId, user: user };

    fetch("/api/view_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed["error"]) {
          alert("error");
        }
      });
  };

  return (
    <div className="feed-rec-container">
      <div>
        <div className="feed-rec">
          <div className="feed-rec-card-header">
            <div className="user-info">
              <h3 className="rec-desc">
                Recommended by{" "}
                <span
                  onClick={() => {
                    const url = "/app/profile/" + props.recInfo.user;

                    history.push(url);
                  }}
                  className="span-recommender"
                >
                  {props.recInfo.user}
                </span>
              </h3>
              {props.followButton === "Following" ? (
                <button
                  style={{ backgroundColor: "#00e0c3", color: "black" }}
                  className="feed-rec-follow-button"
                  onClick={() => {
                    props.unfollow(props.recInfo.user);
                  }}
                >
                  <b>{props.followButton}</b>
                </button>
              ) : (
                <button
                  onClick={() => {
                    props.follow(props.recInfo.user);
                  }}
                  className="feed-rec-follow-button"
                >
                  <b>{props.followButton}</b>
                </button>
              )}
            </div>
            <div className="rec-info">
              <div
                className="like-icon"
                onClick={() => {
                  if (props.recInfo.liked === true) {
                    props.unlikeRec(props.recInfo._id);

                    props.setRender(props.render + 1);
                  }
                  if (props.recInfo.liked === false) {
                    props.likeRec(props.recInfo._id);

                    props.setRender(props.render + 1);
                  }
                }}
              >
                {props.recInfo.liked === true ? (
                  <LikedHeart />
                ) : (
                  <UnlikedHeart />
                )}
              </div>

              <h3 className="feed-likes-label">
                {"Likes: " + props.recInfo.likes}
              </h3>
            </div>
          </div>
          <div className="loading-spinner">
            <iframe
              style={{ margin: "auto" }}
              onLoad={() => {
                const arr = document.getElementsByClassName("loading-spinner");
                for (let i = 0; i < arr.length; i++) {
                  arr[i].style.backgroundImage = "none";
                }
              }}
              className="feed-rec-iframe"
              src={
                "https://open.spotify.com/embed/track/" +
                props.recInfo.uri.substr(14)
              }
              width="100%"
              height="500"
              frameBorder="1"
              allowtransparency="true"
              allow="encrypted-media"
            ></iframe>
          </div>
          <div
            style={{
              display: "block",
              width: "100%",
              height: "4rem",
              alignContent: "center",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            {" "}
            <h3
              style={{
                float: "left",

                position: "relative",
                left: "2rem",
              }}
            >
              {time !== null && time + " " + metric + " ago"}
            </h3>
            <div
              style={{
                float: "right",
                position: "relative",
                right: "2rem",
              }}
            >
              <HiOutlineEye
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  marginRight: "0.5rem",
                }}
                size="2em"
                color="white"
              />
              <h3 style={{ display: "inline-block", verticalAlign: "middle" }}>
                {props.recInfo.views}
              </h3>
            </div>
          </div>
        </div>

        {props.nextRec && (
          <div
            className="next-button"
            onClick={() => {
              setMounted(false);

              props.nextRec();
            }}
          >
            <GrLinkNext style={{ padding: "0.5rem" }} size="2em" />
          </div>
        )}
      </div>
    </div>
  );
};
