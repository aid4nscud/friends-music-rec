import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";
import "./DiscoverRec.css";
import { GrLinkNext } from "react-icons/gr";

export const DiscoverRec = (props) => {
  const [likes, setLikes] = useState(0);
  const [placeholderLiked, setPlaceholderLiked] = useState(false);
  const [time, setTime] = useState("");
  const [metric, setMetric] = useState("minutes");
  
  const history = useHistory();
  let uri = props.recInfo.uri;
  let uriCode = uri.substr(14);
  let url = "https://open.spotify.com/embed/track/" + uriCode;

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
                <LikedHeart />
              ) : (
                <UnlikedHeart />
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
                    style={{ backgroundColor: "#00E0C3", color: "black" }}
                    className="discover-rec-follow-button"
                  >
                    <b>{props.followButton}</b>
                  </button>
                )}
              </h3>
            </div>
          )}
        </div>
        <div onClick={() => {
              alert('bruh')
              const audio = document.getElementsByTagName("audio");
              console.log(audio);
            }} className="loading-spinner">
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
          {time !== null && time + " " + metric + " ago"}
          
        </h3>
      </div>
      <div
        className="next-button"
        onClick={() => {
          setLikes(0);
          props.nextRec();
          setPlaceholderLiked(false);
        }}
      >
        <GrLinkNext color="white" style={{ padding: "0.5rem" }} size="2em" />
      </div>
    </div>
  );
};
