import React, { useState, useEffect } from "react";
import auth from "../../utils/auth";
import { MakeRec } from "../MakeRec/MakeRec.js";
import { Recommendations } from "../Recommendations/Recommendations";
import { useHistory } from "react-router-dom";
import { Profile } from "../Profile/Profile";


export const AppLayout = (props) => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const history = useHistory();

  
  return (
    <div className="app-layout">
      <button
        onClick={() => {
          auth.logout(() => {
            history.push("/");
          });
        }}
      >
        Logout
      </button>

      <Profile />

      
      <Recommendations
        spotifyToken={spotifyToken}
        setSpotifyToken={setSpotifyToken}
      />
      <MakeRec spotifyToken={spotifyToken} setSpotifyToken={setSpotifyToken} />
    </div>
  );
};
