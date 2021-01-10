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
            auth.logout(() => {
              history.push("/");
              clearCookies();
            });
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
