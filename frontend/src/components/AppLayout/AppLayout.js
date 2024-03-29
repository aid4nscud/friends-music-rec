import React, { useState, useEffect } from "react";
import { SearchRec } from "../SearchRec/SearchRec";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { Profile } from "../Profile/Profile";
import { getCookie, clearCookies } from "../../utils/auth";
import auth from "../../utils/auth";
import { NavBar } from "../NavBar/NavBar";
import "./AppLayout.css";
import { SearchedProfile } from "../SearchedProfile/SearchedProfile";
import { MainRecs } from "../MainRecs/MainRecs";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { EditProfile } from "../EditProfile/EditProfile";

export const AppLayout = (props) => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [popup, setPopup] = useState(null);

  const decode = async () => {
    const token = getCookie("token");
    const user = getCookie("user");

    let authedFunc = async () => {
      let authVar = await fetch("/auth_decode", {
        headers: {
          Authorization: "Bearer " + token,
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((parsed) => {
          if (parsed["error"]) {
            auth.setAuthenticated(false);
            clearCookies();
            return <Redirect to="/" />;
          }
          if (parsed["user"]) {
            if (user === null && getCookie("user") === null) {
              const cookie =
                "user=" +
                parsed["user"] +
                "; max-age=" +
                30 * 24 * 60 * 60 +
                "; SameSite=Strict;";
              document.cookie = cookie;
            }

            auth.setAuthenticated(true);
          } else {
            auth.setAuthenticated(false);
            clearCookies();

            return <Redirect to="/" />;
          }
        });

      return authVar;
    };

    authedFunc();
  };

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
          <Route
            exact
            path="/app/listen"
            component={MainRecs}
            spotifyToken={spotifyToken}
            setSpotifyToken={setSpotifyToken}
          />

          <Route
            exact
            path="/app/me"
            render={() => <Profile popup={popup} setPopup={setPopup} />}
          />

          <Route exact path="/app/profile/:user" component={SearchedProfile} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </div>
  );
};
