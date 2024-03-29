import React, { useEffect, useState } from "react";
import "./SearchedUserRec.css";

import { useParams } from "react-router-dom";
import { getCookie } from "../../utils/auth";
import { HiOutlineEye } from "react-icons/hi";
import { BsLightningFill } from "react-icons/bs";

export const SearchedUserRec = (props) => {
  const { user } = useParams();
  const [liked, setLiked] = useState(props.liked);
  const [likes, setLikes] = useState(0);
  const [time, setTime] = useState(null);
  const [metric, setMetric] = useState("minutes");
  const [justNow, setJustNow] = useState(false);
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  useEffect(() => {
    let currTime = Date.now() / 1000;
    let stored_time = props.date;

    let time_dif = (currTime - stored_time) / 60;

    if (time_dif < 2) {
      setJustNow(true);
    }

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
  }, []);

  return (
    <div className="searched-user-rec">
      <div className="searched-profile-card-header">
        {user !== getCookie("user") && (
          <div
            className="heart-container"
            onClick={() => {
              if (liked === true) {
                props.unlikeRec(props.recID);
                setLiked(false);
                setLikes(likes - 1);
              }
              if (liked === false) {
                props.likeRec(props.recID);
                setLiked(true);
                setLikes(likes + 1);
              }
            }}
          >
            {liked === true ? <h2>Like</h2> : <h2>LIKED</h2>}
          </div>
        )}

        <h3 className="searched-rec-likes-label">
          {"Likes: " + (likes + props.likes)}
        </h3>
        <div
          style={{
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          <BsLightningFill
            style={{ display: "inline-block", verticalAlign: "middle" }}
            size="1.5em"
            color="#F70C76"
          />
          <h3
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginLeft: "0.5rem",
            }}
          >
            315k
          </h3>
        </div>
      </div>
      <div className="loading-spinner searched-user-rec-div">
        <iframe
          onLoad={() => {
            const arr = document.getElementsByClassName(
              "searched-user-rec-div"
            );
            for (let i = 0; i < arr.length; i++) {
              arr[i].style.backgroundImage = "none";
            }
          }}
          src={url}
          width="100%"
          height="300"
          frameBorder="1"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
        <div>
          {" "}
          <h3 style={{ float: "left", position: "relative", left: "2rem" }}>
            {justNow === false ? time + " " + metric + " ago" : "just now"}
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
              {props.views}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
