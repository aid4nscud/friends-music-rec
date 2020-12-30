import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import "./ActivityFeed.css";

export const ActivityFeed = () => {
  const [notifications, setNotifications] = useState(null);
  const [time, setTime] = useState(Date.now()/1000) 

  useEffect(() => {
    let curr_time = Date.now()
    curr_time = curr_time/1000
    setTime(curr_time)
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

            if (type === "like") {
              message = (
                <h3 style={{ marginLeft: "1rem" }}>
                  <span
                    style={{ fontSize: "large", marginLeft: "0rem" }}
                    className="span-user"
                  >
                    {not["from"]}
                  </span>{" "}
                  liked your song recommendation!
                </h3>
              );
            }
            if (type === "follow") {
              message = (
                <h3 style={{ marginLeft: "1rem" }}>
                  <span
                    style={{ fontSize: "large", marginLeft: "0rem" }}
                    className="span-user"
                  >
                    {not["from"]}
                  </span>{" "}
                  started following you!
                </h3>
              );
            }
            if (type === "create_account") {
              message = (
                <h3 style={{ marginLeft: "1rem" }}>You created an account!</h3>
              );
            }

            const timeDif = time - not['time']

            return (
              <div className="notification">
                <h2 className="notif-message">{message}</h2>
                <h3 className='notif-date'>
                  {Math.round(timeDif/60) + ' minutes ago'}
                </h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
