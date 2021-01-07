import React, { useState, useEffect } from "react";
import { SearchRec } from "../SearchRec/SearchRec";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { AuthRoute } from "../AuthRoute";
import { NavBar } from "../NavBar/NavBar";
import "./AppLayout.css";
import { SearchedProfile } from "../SearchedProfile/SearchedProfile";
import { MainRecs } from "../MainRecs/MainRecs";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { EditProfile } from "../EditProfile/EditProfile";

export const AppLayout = (props) => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="layout-container">
      <div className="app-layout">
        <NavBar popup={popup} setPopup={setPopup} />

        {popup !== null && <div className="popup-overlay"></div>}

        {popup === "search-rec" && (
          <div className="popup">
            <SearchRec
              setPopup={setPopup}
              spotifyToken={spotifyToken}
              setSpotifyToken={setSpotifyToken}
            />
          </div>
        )}

        {popup === "edit-profile" && (
          <div
            className="popup"
            style={{
              width: "30%",
              top: "15%",
              bottom: "15%",
              left: "35%",
              minHeight: "40vh",
              maxHeight: "40vh",
              margin: "auto",
            }}
          >
            {popup !== null && (
              <div
                style={{
                  display: "block",
                  width: "100%",
                  height: "10%",
                  alignContent: "center",
                  justifyContent: "center",
                }}
                className="popup-close-button"
                style={{
                  display: "block",
                  position: "relative",
                }}
                onClick={() => {
                  setPopup(null);
                }}
              >
                <AiOutlineCloseCircle size="3em" color="black" />
              </div>
            )}
            <div
              style={{
                display: "block",
                width: "100%",
                height: "50%",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <EditProfile setPopup={setPopup} />
            </div>
          </div>
        )}

        <Switch>
          <AuthRoute
            exact
            path="/app/listen"
            component={MainRecs}
            spotifyToken={spotifyToken}
            setSpotifyToken={setSpotifyToken}
          />

          <AuthRoute
            exact
            path="/app/me"
            component={Profile}
            popup={popup}
            setPopup={setPopup}
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
      </div>
    </div>
  );
};
