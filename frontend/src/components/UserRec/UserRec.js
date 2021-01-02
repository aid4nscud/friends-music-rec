import React, { useState, useEffect } from "react";
import "./UserRec.css";
import { FaMinusCircle } from "react-icons/fa";

export const UserRec = (props) => {
  let uri = props.uri;
  let uriCode = uri.substr(14);
  const [time, setTime] = useState(null);
  const [metric, setMetric] = useState("minutes");
  const [justNow, setJustNow] = useState(false)

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
    <div className="user-rec">
      <div className="profile-card-header">
        <h3 className="user-rec-likes-label">{"Likes: " + props.likes}</h3>
      </div>
      <div className="loading-spinner user-rec-div">
        <iframe
          onLoad={() => {
            const arr = document.getElementsByClassName("user-rec-div");
            for (let i = 0; i < arr.length; i++) {
              arr[i].style.backgroundImage = "none";
            }
          }}
          src={url}
          width="600"
          height="300"
          frameBorder="1"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
        <h3 style={{ position: "relative", left: "2rem", float: "left" }}>
          {justNow === false ? time + " " + metric + " ago" : "just now"}
        </h3>
        <div
          className="remove-rec-icon"
          onClick={() => {
            props.deleteRec(props.uri);
          }}
        >
          <FaMinusCircle size="2em" color="white" />
        </div>
      </div>
    </div>
  );
};
