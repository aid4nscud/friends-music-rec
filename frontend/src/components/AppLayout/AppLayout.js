import React, { useState } from "react";
import { CreateAndExplore } from "../CreateAndExplore/CreateAndExplore";
import { Discover } from "../Discover/Discover";
import { Switch } from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { AuthRoute } from "../AuthRoute";
import { NavBar } from "../NavBar/NavBar";
import { FriendRecs } from "../FriendRecs/FriendRecs";
import './AppLayout.css'

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
          path="/app/create+explore"
          component={CreateAndExplore}
          spotifyToken={spotifyToken}
          setSpotifyToken={setSpotifyToken}
        />
      </Switch>
    </div>
  );
};
