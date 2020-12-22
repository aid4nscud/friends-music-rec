import { useEffect } from "react";


import React from "react";
import { SearchRec } from "../SearchRec/SearchRec";
import "./CreateAndExplore.css";

export const CreateAndExplore = (props) => {
  useEffect(()=> {
    window.scrollTo(0, 0);
  })
  return (
    <div className="create-explore">
      <SearchRec
        spotifyToken={props.spotifyToken}
        setSpotifyToken={props.setSpotifyToken}
      />
    </div>
  );
};
