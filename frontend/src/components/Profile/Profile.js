import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import { UserRec } from "../UserRec/UserRec";
import "./Profile.css";

export const Profile = (props) => {
  const [userRecs, setUserRecs] = useState(null);
  const [user, setUser] = useState(getCookie("user"));
  const [render, setRender] = useState(0);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

  const deleteRec = (song) => {
    const recommender = getCookie("user");

    const rec = {
      song: song,
      user: recommender,
    };
    fetch("/api/delete_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec),
    });

    setRender(render + 1);
    console.log("rec succesfully deleted");
  };

  useEffect(() => {
    if (user === null) {
      let query = getCookie("user");

      const url = "/api/get_user_profile";

      const data = { user: query };
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((parsedJSON) => {
          alert(parsedJSON["recs"]);
          if (parsedJSON["recs"].length > 0) {
            setUserRecs(parsedJSON["recs"]);
            setFollowers(parsedJSON["num_followers"]);
            setFollowing(parsedJSON["num_following"]);
          } else if (
            parsedJSON["num_followers"] &&
            parsedJSON["recs"].length <= 0
          ) {
            setFollowers(parsedJSON["num_followers"]);
            setFollowing(parsedJSON["num_following"]);
          }
          setUser(query);
        });
    } else {
      const url = "/api/get_user_profile";
      const data = { user: user };
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            setUserRecs(parsedJSON["recs"]);
            setFollowers(parsedJSON["num_followers"]);
            setFollowing(parsedJSON["num_following"]);
          } else if (
            parsedJSON["num_followers"] &&
            parsedJSON["recs"].length <= 0
          ) {
            setFollowers(parsedJSON["num_followers"]);
            setFollowing(parsedJSON["num_following"]);
          }
        });
    }
  }, [render]);

  return (
    <div className="profile">
      {user && (
        <div className="profile-header">
          <h1>
            Welcome to your profile,  <span className="span-user">{user}</span>
          </h1>
          <ul className="user-social-info">
            <li style={{ borderRightStyle: "solid", borderColor: "black" }}>
              {followers === null ? "Followers: 0" : "Followers: " + followers}
            </li>
            <li style={{ borderRightStyle: "solid", borderColor: "black" }}>
              {following === null ? "Following: 0" : "Following: " + following}
            </li>
            <li>{userRecs === null ? "Recs: 0" : "Recs: " + userRecs.length}</li>
          </ul>
        </div>
      )}

      {userRecs !== null ? (
        <h2>Your Song Recommendations</h2>
      ) : (
        <h2>Once you make a recommendation, find it here!</h2>
      )}

      {userRecs !== null && (
        <div className="profile-recs">
          {userRecs.map((rec) => {
            return (
              <UserRec
              render={render}
              setRender={setRender}
                deleteRec={deleteRec}
                likes={rec.likes}
                uri={rec.uri}
                song={rec.song}
                artist={rec.artist}
                images={rec.images}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
