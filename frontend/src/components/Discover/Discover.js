import React, { useState, useEffect } from "react";
import "./Discover.css";
import { DiscoverRec } from "../DiscoverRec/DiscoverRec";
import { getCookie } from "../../utils/auth";

export const Discover = (props) => {
  // const [recs, setRecs] = useState(null);
  const [render, setRender] = useState(0);

  // useEffect(() => {
  //   const data = {'user':getCookie("user")};
  //   if (data['user'] !== null) {
  //     const url = "/api/get_discover_recs"
  //     fetch(url, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     })
  //       .then((res) => res.json())
  //       .then((parsedJSON) => {
  //         if (parsedJSON["recs"].length > 0) {
  //           setRecs(parsedJSON["recs"]);
  //         }
  //       });
  //   } else {
  //     return alert('bruhhhhhhhhh')

  //   }
  // }, []);

  return (
    <div className="discover">
      {props.recs === null ? (
        <h1>No recs rn G</h1>
      ) : (
        <div>
          <DiscoverRec
          liked = {props.liked}
          setLiked={props.setLiked}
            likes={props.recs[props.index].likes}
            id={props.recs[props.index]._id}
            user={props.recs[props.index].user}
            spotifyToken={props.spotifyToken}
            setSpotifyToken={props.setSpotifyToken}
            images={props.recs[props.index].images}
            song={props.recs[props.index].song}
            artist={props.recs[props.index].artist}
            uri={props.recs[props.index].uri}
            like={props.likeRec}
            nextRec={props.nextRec}
            follow={props.follow}
            followButton={props.followButton}
            moreInfo={props.moreInfo}
            setMoreInfo={props.setMoreInfo}
          />
        </div>
      )}
    </div>
  );
};
