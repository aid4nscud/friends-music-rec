import React, { useEffect, useState } from "react";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";
import { GrLinkNext } from "react-icons/gr";

import { useHistory } from "react-router-dom";
import "./FeedRec.css";

export const FeedRec = (props) => {
  const [time, setTime] = useState(null);
  const [metric, setMetric] = useState("minutes");

  const history = useHistory();

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
                  style={{ backgroundColor: "#00E0C3", color: "black" }}
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
            {time !== null && time + ' ' + metric + " ago"}
          </h3>
        </div>

        <div
          className="next-button"
          onClick={() => {
            props.nextRec();
          }}
        >
          <GrLinkNext style={{ padding: "0.5rem" }} size="2em" />
        </div>
      </div>
    </div>
  );
};
