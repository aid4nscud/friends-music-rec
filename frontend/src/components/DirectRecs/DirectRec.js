import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import "./DirectRec.css";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";

export const DirectRec = (props) => {
  const [time, setTime] = useState(null);
  const [metric, setMetric] = useState("minutes");
  const [justNow, setJustNow] = useState(false);
  const [placeholderLiked, setPlaceholderLiked] = useState(false);
  const [liked, setLiked] = useState(null);

  useEffect(() => {
    setPlaceholderLiked(false);
    let user = getCookie("user");
    let responses = props.recInfo.responses;
    console.log(responses);
    let liked = responses[user].liked;

    setLiked(liked);
  }, [props.recInfo]);

  useEffect(() => {
    // UPDATE VIEW COUNT
    viewDir(props.recInfo.date, props.recInfo.user);
  }, [props.recInfo.viewed]);

  useEffect(() => {
    let currTime = Date.now() / 1000;
    let stored_time = props.recInfo.date;

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
  }, [props.recInfo]);

  const viewDir = (recDate, recommender) => {
    const user = getCookie("user");

    const data = { recDate: recDate, targUser: recommender, reqUser: user };

    fetch("/api/view_dir_rec", {
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

  const likeDir = (recDate, recommender) => {
    const user = getCookie("user");

    const data = { recDate: recDate, targUser: recommender, reqUser: user };

    fetch("/api/like_dir_rec", {
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
    <div
      style={{ overflowX: "hidden", overflowY: "hidden" }}
      className="direct-rec"
    >
      <div
        style={{
          alignContent: "center",
          justifyContent: "center",
          height: "6rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            verticalAlign: "middle",
            padding: "0rem",
            width: "100%",
          }}
        >
          <h3
            style={{
              color: "white",
              flex: "1",
            }}
          >
            from{" "}
            <span
              style={{
                fontSize: "larger",
                display: "inline-block",

                margin: "0",
                marginLeft: "1rem",
                marginRight: "2rem",
              }}
              className="span-user"
            >
              {props.recInfo.user}
            </span>
          </h3>
          <div
            style={{
              flex: "1",
              display: "flex",

              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {" "}
            <p style={{ alignSelf: "center", color: "white" }}>
              {'"' + props.recInfo.caption + '"'}
            </p>
          </div>
          {liked !== null && (
            <div
              style={{
                flex: "1",
                display: "flex",
                background: "black",

                justifyContent: "center",
                alignContent: "center",
              }}
              onClick={() => {
                if (liked === false) {
                  likeDir(props.recInfo.date, props.recInfo.user);

                  setPlaceholderLiked(true);
                }
              }}
            >
              {liked === true || placeholderLiked === true ? (
                <LikedHeart style={{ alignSelf: "center" }} />
              ) : (
                <UnlikedHeart style={{ alignSelf: "center" }} />
              )}
            </div>
          )}
        </div>
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
          height: "4rem",

          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <h3
          style={{
            float: "left",
            color: "white",
            alignSelf: "center",

            position: "relative",
            left: "2rem",
          }}
        >
          {justNow === false ? time + " " + metric + " ago" : "just now"}
        </h3>
      </div>
    </div>
  );
};
