import React from "react";
import { Link, useHistory } from "react-router-dom";
import auth from "../../utils/auth";
import './NavBar.css'
import { ReactComponent as ProfileIcon } from "../../profile-icon.svg";
import { ReactComponent as ListenIcon } from "../../listen-icon.svg";
import { ReactComponent as DiscoverIcon } from "../../discover-icon.svg";

export const NavBar = () => {
  const history = useHistory();
  return (
    <div className='navbar'>
      <ul>
        <li>
          <Link to="/app/me" ><ProfileIcon className='nav-icon'/></Link>
        </li>
        <li>
          <Link to="/app/listen" ><ListenIcon className='nav-icon'/></Link>
        </li>
        <li>
          <Link to="/app/create+explore" ><DiscoverIcon className='nav-icon'/></Link>
        </li>
      </ul>

      <button
        onClick={() => {
          auth.logout(() => {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            history.push("/");
          });
        }}
      >
        Logout
      </button>
      
    </div>
  );
};
