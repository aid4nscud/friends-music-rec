import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { ReactComponent as ProfileIcon } from "../../assets/profile-icon.svg";
import { ReactComponent as ListenIcon } from "../../assets/headphones.svg";
import { ReactComponent as DiscoverIcon } from "../../assets/discover-icon.svg";

export const NavBar = (props) => {
  const baseURL = "localhost:3000/";

  const path = window.location.href.substring(baseURL.length + 11);

  useEffect(() => {
    switch (path) {
      case "me":
        document.getElementById("profile-nav-icon").style.transform =
          "scale(1.5)";
        document.getElementById("listen-nav-icon").style.transform = "scale(1)";

        break;
      case "listen":
        document.getElementById("listen-nav-icon").style.transform =
          "scale(1.5)";
        document.getElementById("profile-nav-icon").style.transform =
          "scale(1)";

        break;

      default:
        break;
    }
  });
  return (
    <div className="navbar">
      <ul>
        <div className="navbar-logo" style={{ color: "white" }}>
          LOGO
        </div>
        <li>
          <Link to="/app/me">
            <ProfileIcon id="profile-nav-icon" className="nav-icon" />
          </Link>
        </li>
        <li>
          <Link to="/app/listen">
            <ListenIcon id="listen-nav-icon" className="nav-icon" />
          </Link>
        </li>

        <div
          onClick={() => {
            if (props.popup !== "search-rec") {
              props.setPopup("search-rec");
            } else {
              props.setPopup(null);
            }
          }}
          className="create-rec-icon"
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            width: "20%",
          }}
        >
          <h3
            style={{
              fontSize: "1.2em",
              display: "inline-block",
              marginRight: "1rem",
              verticalAlign: "middle",
            }}
          >
            CREATE
          </h3>
          <DiscoverIcon
            style={{
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        </div>
      </ul>
    </div>
  );
};
