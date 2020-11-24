import React, { useState} from "react";
import auth from "../../utils/auth";
import { MakeRec } from "../MakeRec/MakeRec.js";
import { Recommendations } from "../Recommendations/Recommendations";
import { Switch} from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { AuthRoute } from "../AuthRoute";
import {NavBar} from '../NavBar/NavBar'

export const AppLayout = (props) => {
  const [spotifyToken, setSpotifyToken] = useState(null);

  return (
    <div className="app-layout">
      
      <NavBar/>

      <Switch>
        <AuthRoute exact path="/app/me" component={Profile}  />

        <AuthRoute
          exact
          path="/app/listen"
          component={Recommendations}
          spotifyToken={spotifyToken} setSpotifyToken={setSpotifyToken}
      
          
        />

        <AuthRoute
          exact
          path="/app/recommend"
          component={MakeRec}
          spotifyToken={spotifyToken} setSpotifyToken={setSpotifyToken}
  
          
        />
      </Switch>


    </div>
  );
};
