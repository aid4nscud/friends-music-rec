import React, { useEffect, useState } from "react";
import { FaKaaba } from "react-icons/fa";
import { Route, Redirect, useHistory } from "react-router-dom";
import auth, { clearCookies } from "../utils/auth";
import { getCookie } from "../utils/auth";

export const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        if (auth.isAuthenticated()) {
          return <Component {...rest} />;
        }
        if (getCookie("user") !== null) {
          return <Component {...rest} />;
        } else {
          clearCookies();
          return <Redirect to="/" />;
        }
      }}
    />
  );
};
