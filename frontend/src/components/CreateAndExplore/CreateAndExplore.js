import { useState, useEffect } from "react";
import { getCookie } from "../../utils/auth";

import React from "react";
import { SearchRec } from "../SearchRec/SearchRec";
import "./CreateAndExplore.css";
import { Discover } from "../Discover/Discover";

export const CreateAndExplore = (props) => {
  return (
    <div className="create-explore">
      <Discover
        spotifyToken={props.spotifyToken}
        setSpotifyToken={props.setSpotifyToken}
      />

      <SearchRec
        spotifyToken={props.spotifyToken}
        setSpotifyToken={props.setSpotifyToken}
      />
    </div>
  );
};
