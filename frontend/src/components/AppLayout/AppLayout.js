import React, { useState } from "react";
import { CreateAndExplore } from "../CreateAndExplore/CreateAndExplore";
import auth, { getCookie } from "../../utils/auth";
import { Switch, useHistory } from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { AuthRoute } from "../AuthRoute";
import { NavBar } from "../NavBar/NavBar";
import { FriendRecs } from "../FriendRecs/FriendRecs";
import "./AppLayout.css";
import { SearchedProfile } from "../SearchedProfile/SearchedProfile";

export const AppLayout = (props) => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const history = useHistory();

  return (
    <div className="layout-container">
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

          <AuthRoute
            exact
            path="/app/profile/:user"
            component={SearchedProfile}
          />
        </Switch>
      </div>
      <div className="logout-button-container">
        <button
          className="logout-button"
          onClick={() => {
            auth.logout(() => {
              document.cookie.split(";").forEach(function (c) {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(
                    /=.*/,
                    "=;expires=" + new Date().toUTCString() + ";path=/"
                  );
              });
              
              history.push("/");
            });
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
