import React from "react";
import { Link, useHistory } from "react-router-dom";
import auth from "../../utils/auth";
import './NavBar.css'

export const NavBar = () => {
  const history = useHistory();
  return (
    <div className='navbar'>
      <ul>
        <li>
          <Link to="/app/me">PROFILE</Link>
        </li>
        <li>
          <Link to="/app/recommend">RECOMMEND</Link>
        </li>
        <li>
          <Link to="/app/listen">LISTEN</Link>
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
