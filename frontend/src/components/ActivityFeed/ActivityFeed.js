import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import './ActivityFeed.css'

export const ActivityFeed = () => {
  const [notifications, setNotifications] = useState(null);

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
    <div className='activity-feed'>
        <div className='activity-feed-header'><h2>Activity</h2></div>
      {notifications !== null &&
        notifications.map((not) => {
          let message;
          const type = not["type"];

          if (type === "like") {
            message = (
              <h3>
                <span style={{fontSize:'large'}} className="span-user">{not["from"]}</span> liked your song
                recommendation!
              </h3>
            );
          }
          if (type === "follow") {
            message = (
              <h3>
                <span style={{fontSize:'large'}}className="span-user">{not["from"]}</span> started
                following you!
              </h3>
            );
          }
          if (type === "create_account") {
            message = (
              <h3>
                {" "}
                {"You created an account on " +
                  not["time"].substring(8, 11) +
                  " " +
                  not["time"].substring(5, 7) +
                  ", " +
                  not["time"].substring(12, 16)}
              </h3>
            );
          }

          return <div className='notification'>{message}</div>;
        })}
    </div>
  );
};
