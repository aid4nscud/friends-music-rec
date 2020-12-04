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
          <Link to="/app/me" style={{textDecoration: 'none', color: "white"}}>PROFILE</Link>
        </li>
        <li>
          <Link to="/app/listen" style={{textDecoration: 'none', color: "white"}}>LISTEN</Link>
        </li>
        <li>
          <Link to="/app/create+explore" style={{textDecoration: 'none', color: "white"}}>EXPLORE</Link>
        </li>
        <li>
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
        </li>
      </ul>
      
    </div>
  );
};
