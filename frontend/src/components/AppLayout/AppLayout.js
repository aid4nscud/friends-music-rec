import React, { useState } from "react";
import { MakeRec } from "../MakeRec/MakeRec.js";
import { Discover } from "../Discover/Discover";
import { Switch } from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { AuthRoute } from "../AuthRoute";
import { NavBar } from "../NavBar/NavBar";
import { FriendRecs } from "../FriendRecs/FriendRecs";

export const AppLayout = (props) => {
  const [spotifyToken, setSpotifyToken] = useState(null);

  return (
    <div className="app-layout">
      <NavBar />

      <Switch>
        <AuthRoute
          exact
          path="/app/listen"
          component={FriendRecs}
          spotifyToken={spotifyToken}
          setSpotifyToken={setSpotifyToken}
        />

        <AuthRoute exact path="/app/me" component={Profile} />

        <AuthRoute
          exact
          path="/app/discover"
          component={Discover}
          spotifyToken={spotifyToken}
          setSpotifyToken={setSpotifyToken}
        />

        <AuthRoute
          exact
          path="/app/recommend"
          component={MakeRec}
          spotifyToken={spotifyToken}
          setSpotifyToken={setSpotifyToken}
        />
      </Switch>
    </div>
  );
};
