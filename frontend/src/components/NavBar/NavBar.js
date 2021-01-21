import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export const NavBar = (props) => {
  const baseURL = "localhost:3000/";

  const path = window.location.href.substring(baseURL.length + 11);

  // useEffect(() => {
  //   switch (path) {
  //     case "me":
  //       document.getElementById("profile-nav-icon").style.transform =
  //         "scale(1.5)";
  //       document.getElementById("listen-nav-icon").style.transform = "scale(1)";

  //       break;
  //     case "listen":
  //       document.getElementById("listen-nav-icon").style.transform =
  //         "scale(1.5)";
  //       document.getElementById("profile-nav-icon").style.transform =
  //         "scale(1)";

  //       break;

  //     default:
  //       break;
  //   }
  // });
  return (
    <div className="navbar">
      <ul>
        <div className="navbar-logo" style={{ color: "white" }}>
          LOGO
        </div>
        <li>
          <Link to="/app/me">
            <h2>Profile</h2>
          </Link>
        </li>
        <li>
          <Link to="/app/listen">
            <h2>Profile</h2>
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
        </div>
      </ul>
    </div>
  );
};
