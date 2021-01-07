import React, { useEffect, useState } from "react";
import "./DirectRec.css";

export const DirectRec = (props) => {
  const [time, setTime] = useState(null);
  const [metric, setMetric] = useState("minutes");

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
    <div className="direct-rec">
      <div
        style={{
          alignContent: "center",
          justifyContent: "center",
          height: "6rem",
        }}
      >
        <h3
          style={{
            color: "black",
            display: "inline-block",
            verticalAlign: "middle",
            padding: "0rem",
          }}
        >
          from{" "}
          <span
            style={{
              fontSize: "larger",
              display: "inline-block",
              verticalAlign: "middle",
              margin: "0",
              marginLeft: "1rem",
              marginRight: "2rem",
            }}
            className="span-user"
          >
            {props.recInfo.user}
          </span>
        </h3>
        <p>"Listen to this song when you are big chiefin'"</p>
      </div>
      <iframe
        className="loading-spinner"
        style={{
          margin: "auto",
          borderRadius: "1rem",
          borderStyle: "hidden",
          borderColor: "white",
        }}
        onLoad={() => {
          const arr = document.getElementsByClassName("loading-spinner");
          for (let i = 0; i < arr.length; i++) {
            arr[i].style.backgroundImage = "none";
          }
        }}
        width="100%"
        height="500px"
        src={
          "https://open.spotify.com/embed/track/" + props.recInfo.uri.substr(14)
        }
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      />
      <div
        style={{
          display: "block",
          width: "100%",
          height: "3rem",

          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <h3
          style={{
            float: "left",
            color: "black",

            position: "relative",
            left: "2rem",
          }}
        >
          {time !== null && time + " " + metric + " ago"}
        </h3>
      </div>
    </div>
  );
};
