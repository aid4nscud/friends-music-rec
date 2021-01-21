import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { HiOutlineEye } from "react-icons/hi";

import "./DiscoverRec.css";
import { GrLinkNext } from "react-icons/gr";
import { getCookie } from "../../utils/auth";

export const DiscoverRec = (props) => {
  const [likes, setLikes] = useState(0);
  const [placeholderLiked, setPlaceholderLiked] = useState(false);
  const [time, setTime] = useState("");
  const [metric, setMetric] = useState("minutes");

  const [mounted, setMounted] = useState(false);

  const history = useHistory();
  let uri = props.recInfo.uri;
  let uriCode = uri.substr(14);
  let url = "https://open.spotify.com/embed/track/" + uriCode;

  useEffect(() => {
    if (mounted === false) {
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
      time_dif = Math.round(time_dif);
      setTime(time_dif);
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
    <div className="container-div">
      <div className="discover-rec">
        <div className="card-header">
          {props.recInfo && (
            <div
              style={{
                float: "left",
                marginLeft: "3rem",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
              onClick={() => {
                if (props.recInfo.liked === false) {
                  if (likes === 0) {
                    props.like(props.recInfo._id);
                    setLikes(likes + 1);
                    setPlaceholderLiked(true);
                  }
                }
              }}
            >
              {props.recInfo.liked === true || placeholderLiked === true ? (
                <h2>Like</h2>
              ) : (
                <h2>LIKED</h2>
              )}
            </div>
          )}

          {(props.recInfo.liked === true || placeholderLiked === true) && (
            <h3 className="likes-number">
              {"Likes: " + (props.recInfo.likes + likes)}
            </h3>
          )}

          {(props.recInfo.liked === true || placeholderLiked === true) && (
            <div className="more-info-desc">
              <h3>
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
                {props.followButton === "Follow" ? (
                  <button
                    className="discover-rec-follow-button"
                    onClick={() => {
                      props.follow(props.recInfo.user);
                    }}
                  >
                    <b>{props.followButton}</b>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      props.unfollow(props.recInfo.user);
                    }}
                    style={{ backgroundColor: "#F70C76" }}
                    className="discover-rec-follow-button"
                  >
                    <b>{props.followButton}</b>
                  </button>
                )}
              </h3>
            </div>
          )}
        </div>
        <div className="loading-spinner">
          <iframe
            id="iframe-test"
            onLoad={() => {
              const arr = document.getElementsByClassName("loading-spinner");
              for (let i = 0; i < arr.length; i++) {
                arr[i].style.backgroundImage = "none";
              }
            }}
            className="discover-rec-iframe"
            src={url}
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
              style={{ display: "inline-block", verticalAlign: "middle" }}
              size="2em"
              color="white"
            />
            <h3
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginLeft: "0.5rem",
              }}
            >
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
            setLikes(0);
            props.nextRec();
            setPlaceholderLiked(false);
          }}
        >
          <GrLinkNext color="white" style={{ padding: "0.5rem" }} size="2em" />
        </div>
      )}
    </div>
  );
};
