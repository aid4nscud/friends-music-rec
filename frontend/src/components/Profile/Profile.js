import React, { useEffect, useState } from "react";
import auth from "../../utils/auth";
import { UserRec } from "../UserRec/UserRec";

export const Profile = () => {
  const [userRecs, setUserRecs] = useState(null);

  useEffect(() => {
    const user = auth.getUser();
    const url = "/get_user_recs/" + user;
    fetch(url)
      .then((res) => res.json())
      .then((parsedJSON) => {
        if (parsedJSON["recs"].length > 0) {
          setUserRecs(parsedJSON["recs"]);
        }
      });
  }, []);

  const user = auth.getUser();

  return (
    <div>
      <h1>{"Welcome to your profile " + user}</h1>
      {userRecs !== null ? <h3>Your Song Recommendations</h3> : <h3>Once you make a recommendation, find it here!</h3>}

      {userRecs !== null &&
        userRecs.map((rec) => {
          return (
            <UserRec song={rec.song} artist={rec.artist} images={rec.images} />
          );
        })}
    </div>
  );
};
