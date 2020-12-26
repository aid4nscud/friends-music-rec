import React, { useState } from "react";
import {SearchRec} from '../SearchRec/SearchRec'
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { AuthRoute } from "../AuthRoute";
import { NavBar } from "../NavBar/NavBar";
import "./AppLayout.css";
import { SearchedProfile } from "../SearchedProfile/SearchedProfile";
import { Footer } from "../Footer/Footer";
import { MainRecs } from "../FriendRecs/MainRecs";

export const AppLayout = (props) => {
  const [spotifyToken, setSpotifyToken] = useState(null);

  return (
    <div className="layout-container">
      <div className="app-layout">
        <NavBar />

        <Switch>
          <AuthRoute
            exact
            path="/app/listen"
            component={MainRecs}
            spotifyToken={spotifyToken}
            setSpotifyToken={setSpotifyToken}
          />

          <AuthRoute exact path="/app/me" component={Profile} />

          <AuthRoute
            exact
            path="/app/create+explore"
            component={SearchRec}
            spotifyToken={spotifyToken}
            setSpotifyToken={setSpotifyToken}
          />

          <AuthRoute
            exact
            path="/app/profile/:user"
            component={SearchedProfile}
          />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
        <Footer />
      </div>
      
    </div>
  );
};
