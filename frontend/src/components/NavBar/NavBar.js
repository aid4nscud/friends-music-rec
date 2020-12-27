import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { ReactComponent as ProfileIcon } from "../../assets/profile-icon.svg";
import { ReactComponent as ListenIcon } from "../../assets/headphones.svg";
import { ReactComponent as DiscoverIcon } from "../../assets/discover-icon.svg";

export const NavBar = (props) => {
  const baseURL = "localhost:3000/";

  // removing the https and base url to be left with the current page location
  const path = window.location.href.substring(baseURL.length + 11);

  useEffect(() => {
    switch (path) {
      case "me":
        document.getElementById('profile-nav-icon').style.transform='scale(1.2)'
        document.getElementById('listen-nav-icon').style.transform='scale(1)'
        document.getElementById('create-explore-nav-icon').style.transform='scale(1)'
        break;
      case "listen":
        document.getElementById('listen-nav-icon').style.transform='scale(1.2)'
        document.getElementById('profile-nav-icon').style.transform='scale(1)'
        document.getElementById('create-explore-nav-icon').style.transform='scale(1)'
        break;
      case "create+explore":
        document.getElementById('create-explore-nav-icon').style.transform='scale(1.2)'
        document.getElementById('profile-nav-icon').style.transform='scale(1)'
        document.getElementById('listen-nav-icon').style.transform='scale(1)'
        break;

      default:
        break;
    }
  });
  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/app/me">
            <ProfileIcon id='profile-nav-icon' className="nav-icon" />
          </Link>
        </li>
        <li>
          <Link to="/app/listen">
            <ListenIcon id='listen-nav-icon' className="nav-icon" />
          </Link>
        </li>
        <li >
          <h3 style={{display:'inline-block', verticalAlign:'middle', marginRight:'1rem'}}>Create</h3>
          <Link  id='create-explore-nav-icon' to="/app/create+explore">
            <DiscoverIcon className="nav-icon" />
          </Link>
        </li>
      </ul>
    </div>
  );
};
