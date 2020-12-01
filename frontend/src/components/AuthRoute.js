import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../utils/auth";
import axios from "axios";
import { getCookie } from "../utils/auth";

const decode = async () => {
  console.log(document.cookie)
  const token = getCookie("token");
  let authed = await axios("/auth_decode", {
    headers: {
      Authorization: "Bearer " + token,
    },
    method: "GET",
  }).then((res) => {
    if (res.data["user"]) {
      if (getCookie("user") === null) {
        const cookie =
          "user=" +
          res.data["user"] +
          "; max-age=" +
          30 * 24 * 60 * 60 +
          "; SameSite=Strict;";
        document.cookie = cookie;
      }
      auth.setAuthenticated(true);
      return true;
    } else {
      auth.setAuthenticated(false);
      return false;
    }
  });

  return authed;
};

export const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        if (getCookie("token") !== null) {
          const authed = decode();

          return authed ? <Component {...rest} /> : <Redirect to="/" />;
        }

        // if(auth.isAuthenticated()){
        //   return <Component {...rest}/>
        // }
        else {
          return <Redirect to="/" />;
        }
      }}
    />
  );
};
