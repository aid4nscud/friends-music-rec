import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css'
import { ReactComponent as ProfileIcon } from "../../assets/profile-icon.svg";
import { ReactComponent as ListenIcon } from "../../assets/headphones.svg";
import { ReactComponent as DiscoverIcon } from "../../assets/discover-icon.svg";

export const NavBar = () => {
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
      
    </div>
  );
};
