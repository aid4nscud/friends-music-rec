import React from "react";
import { useHistory } from "react-router-dom";
import auth, { clearCookies } from "../../utils/auth";
import "./EditProfile.css";

export const EditProfile = (props) => {
  const history = useHistory();
  return (
    <div>
      <div className="logout-button-container">
        <button
          className="logout-button"
          onClick={() => {
            clearCookies();
            auth.logout(() => {
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
