import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getCookie } from "../../utils/auth";
import "./ActivityFeed.css";

export const ActivityFeed = () => {
  const [notifications, setNotifications] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const user = getCookie("user");

    const url = "/api/get_notifications";

    const data = { user: user };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed["error"]) {
          alert("error");
        } else {
          setNotifications(parsed["notifications"]);
        }
      });
  }, []);

  return (
    <div className="activity-feed">
      <div className="activity-feed-header">
        <h2>Activity</h2>
      </div>
      {notifications !== null && (
        <div className="notification-list">
          {notifications.map((not) => {
            let message;
            const type = not["type"];
            let time;
            let metric = "minutes";
            let justNow = false;

            if (type === "like") {
              let currTime = Date.now() / 1000;
              let stored_time = not["time"];
              

              let time_dif = (currTime - stored_time) / 60;

              if (time_dif < 2) {
                justNow = true;
              }

              if (time_dif > 59) {
                metric = "hours";
                time_dif = Math.round(time_dif / 60);
                if (time_dif > 23) {
                  time_dif = Math.round(time_dif / 24);
                  metric = "days";
                  if (time_dif > 7) {
                    time_dif = Math.round(time_dif / 7);
                    metric = "weeks";
                    if (time_dif > 3) {
                      time_dif = Math.round(time_dif / 4);
                      metric = "months";
                      if (time_dif > 11) {
                        time_dif = Math.round(time_dif / 12);
                        metric = "years";
                      } else {
                        time = Math.round(time_dif);
                      }
                    } else {
                      time = Math.round(time_dif);
                    }
                  } else {
                    time = Math.round(time_dif);
                  }
                } else {
                  time = Math.round(time_dif);
                }
              } else {
                time = Math.round(time_dif);
              }

              message = (
                <h3 style={{ marginLeft: "1rem" }}>
                  <span
                    style={{ fontSize: "large", marginLeft: "0rem" }}
                    className="span-user"
                  >
                    <a
                      className="profile-link"
                      onClick={() => {
                        const url = "/app/profile/" + not["from"];
                        history.push(url);
                      }}
                    >
                      {not["from"]}
                    </a>
                  </span>{" "}
                  liked your song recommendation!
                </h3>
              );
            }
            if (type === "follow") {
              let currTime = Date.now() / 1000;
              let stored_time = not["time"];

              let time_dif = (currTime - stored_time) / 60;
              
              if (time_dif < 2) {
                justNow = true;
              }
              if (time_dif > 59) {
                metric = "hours";
                time_dif = Math.round(time_dif / 60);
                if (time_dif > 23) {
                  time_dif = Math.round(time_dif / 24);
                  metric = "days";
                  if (time_dif > 7) {
                    time_dif = Math.round(time_dif / 7);
                    metric = "weeks";
                    if (time_dif > 3) {
                      time_dif = Math.round(time_dif / 4);
                      metric = "months";
                      if (time_dif > 11) {
                        time_dif = Math.round(time_dif / 12);
                        metric = "years";
                      } else {
                        time = Math.round(time_dif);
                      }
                    } else {
                      time = Math.round(time_dif);
                    }
                  } else {
                    time = Math.round(time_dif);
                  }
                } else {
                  time = Math.round(time_dif);
                }
              } else {
                time = Math.round(time_dif);
              }

              message = (
                <h3 style={{ marginLeft: "1rem" }}>
                  <span
                    style={{ fontSize: "large", marginLeft: "0rem" }}
                    className="span-user"
                    onClick={() => {
                      const url = "/app/profile/" + not["from"];

                      history.push(url);
                    }}
                  >
                    <a
                      className="profile-link"
                      onClick={() => {
                        const url = "/app/profile/" + not["from"];
                        history.push(url);
                      }}
                    >
                      {not["from"]}
                    </a>
                  </span>{" "}
                  started following you!
                </h3>
              );
            }
            if (type === "create_account") {
              let currTime = Date.now() / 1000;
              let stored_time = not["time"];

              let time_dif = (currTime - stored_time) / 60;
              
              if (time_dif < 2) {
                justNow = true;
              }
              if (time_dif > 59) {
                metric = "hours";
                time_dif = Math.round(time_dif / 60);
                if (time_dif > 23) {
                  time_dif = Math.round(time_dif / 24);
                  metric = "days";
                  if (time_dif > 7) {
                    time_dif = Math.round(time_dif / 7);
                    metric = "weeks";
                    if (time_dif > 3) {
                      time_dif = Math.round(time_dif / 4);
                      metric = "months";
                      if (time_dif > 11) {
                        time_dif = Math.round(time_dif / 12);
                        metric = "years";
                      } else {
                        time = Math.round(time_dif);
                      }
                    } else {
                      time = Math.round(time_dif);
                    }
                  } else {
                    time = Math.round(time_dif);
                  }
                } else {
                  time = Math.round(time_dif);
                }
              } else {
                time = Math.round(time_dif);
              }

              message = (
                <h3 style={{ marginLeft: "1rem" }}>You created an account!</h3>
              );
            }

            return (
              <div className="notification">
                <h2 className="notif-message">{message}</h2>
                <h3 className="notif-date">
                  {justNow === false
                    ? time + " " + metric + " ago"
                    : "just now"}
                </h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
