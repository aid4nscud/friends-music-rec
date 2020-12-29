import React from "react";
import { useHistory } from "react-router-dom";
import auth from "../../utils/auth";

export const EditProfile = (props) => {
  const history = useHistory();
  return (
    <div>
      {props.popup !== null && (
        <button
          onClick={() => {
            props.setPopup(null);
          }}
        >
          EXIT
        </button>
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
