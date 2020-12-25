import React from 'react'
import { useHistory } from 'react-router-dom'
import './Footer.css'
import auth from '../../utils/auth'


export const Footer = () => {
    const history = useHistory();
    return <footer className='footer'>
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
    </footer>
}