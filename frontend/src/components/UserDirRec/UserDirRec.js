import React, { useState, useEffect } from "react";
import "./UserDirRec.css";

export const UserDirRec = (props) => {
  let uri = props.recInfo.uri;
  let uriCode = uri.substr(14);
  const [time, setTime] = useState(null);
  const [metric, setMetric] = useState("minutes");
  const [justNow, setJustNow] = useState(false);
  const [front, setFront] = useState(true);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

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
  }, []);

  return (
    <div className="dir-rec">
      {front === false && (
        <div>
          <div style={{ display: "flex" }} className="profile-dir-card-header">
            <div
              style={{
                width: "100%",
              }}
            >
              <button
                onClick={() => {
                  setFront(true);
                }}
                style={{
                  position: "relative",
                  top: "1rem",

                  padding: "0.5rem",

                  borderRadius: "1rem",
                  marginBottom: "1rem",
                }}
              >
                Less Info
              </button>
            </div>
          </div>

          <div>
            {props.recInfo.recipients.map((r) => {
              return (
                <div>
                  <h2
                    style={{
                      color: "#f70c76",
                      display: "inline-block",
                      marginRight: "2rem",
                    }}
                  >
                    {r}
                  </h2>
                  <h4
                    style={{
                      color: "white",
                      display: "inline-block",
                      marginRight: "2rem",
                    }}
                  >
                    {"Viewed: "}
                  </h4>
                  <h4 style={{ color: "white", display: "inline-block" }}>
                    {"Liked: "}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {front === true && (
        <div className="profile-dir-card-header">
          <div
            style={{
              width: "100%",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <div>
              {props.recInfo.recipients.length > 1 ? (
                <h3
                  style={{
                    width: "60%",
                    float: "left",
                    position: "relative",
                    left: "2rem",
                  }}
                >
                  {"Sent To: " +
                    props.recInfo.recipients[0] +
                    ", and " +
                    (props.recInfo.recipients.length - 1) +
                    "others"}
                </h3>
              ) : (
                <h3
                  style={{
                    width: "60%",
                    float: "left",
                    position: "relative",
                    left: "2rem",
                  }}
                >
                  Sent To:{" "}
                  <span
                    style={{
                      backgroundColor: "#F70C76",
                      padding: "0.5rem",
                      color: "white",
                      borderRadius: "1rem",
                      marginLeft: "1rem",
                    }}
                  >
                    {props.recInfo.recipients[0]}
                  </span>
                </h3>
              )}
            </div>
            <button
              onClick={() => {
                setFront(false);
              }}
              style={{
                float: "right",
                position: "relative",
                right: "2rem",
                top: "1rem",
                width: "30%",
                padding: "0.5rem",
                borderRadius: "1rem",
              }}
            >
              More Info
            </button>
          </div>

          <div className="loading-spinner dir-rec-div">
            <iframe
              onLoad={() => {
                const arr = document.getElementsByClassName("dir-rec-div");
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
            <h3 style={{ position: "relative", left: "2rem", float: "left" }}>
              {justNow === false ? time + " " + metric + " ago" : "just now"}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
