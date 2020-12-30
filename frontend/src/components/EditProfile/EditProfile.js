import React from "react";
import { useHistory } from "react-router-dom";
import auth from "../../utils/auth";
import './EditProfile.css'
import { AiOutlineCloseCircle } from "react-icons/ai";

export const EditProfile = (props) => {
  const history = useHistory();
  return (
    <div>
      {props.popup !== null && (
        <div className='popup-close-button' style={{float:'right', position:'relative', right:'2rem', top:'1rem'}}
          onClick={() => {
            props.setPopup(null);
          }}
        >
          <AiOutlineCloseCircle size='3em' color='black'/>
        </div>
      )}

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
    </div>
  );
};
