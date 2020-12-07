import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import { UserRec } from "../UserRec/UserRec";
import "./Profile.css";
import {HeartIcon} from '../HeartIcon'

export const Profile = (props) => {
  const [userRecs, setUserRecs] = useState(null);
  const [user, setUser] = useState(null);
  const [render, setRender] = useState(0)

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

   setRender(render+1)
    console.log("rec succesfully deleted");
  };

  useEffect(() => {
    if (user === null) {
      let query = getCookie("user");

      const url = "/get_user_recs/" + query;
      fetch(url)
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            setUserRecs(parsedJSON["recs"]);
          }
          setUser(query);
        });
    } else {
      const url = "/get_user_recs/" + user;
      fetch(url)
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            setUserRecs(parsedJSON["recs"]);
          }
        });
    }
  }, [render]);

  return (
    <div className='profile'>
      {user !== null && (
        <h1>
          Welcome to your profile <span className="span-user">{user}</span>
        </h1>
      )}

      {userRecs !== null ? (
        <h2>Your Song Recommendations</h2>
      ) : (
        <h2>Once you make a recommendation, find it here!</h2>
      )}

      {userRecs !== null &&
        userRecs.map((rec) => {
          return (
            <UserRec deleteRec = {deleteRec} likes={rec.likes} uri={rec.uri} song={rec.song} artist={rec.artist} images={rec.images} />
          );
        })}
    </div>
  );
};
