import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import auth from "../utils/auth";
import { getCookie } from "../utils/auth";

const decode = async () => {
  const token = getCookie("token");
  const user = getCookie("token");

  let authed = await fetch("/auth_decode", {
    headers: {
      Authorization: "Bearer " + token,
    },
    method: "GET",
  })
    .then((res) => res.json())
    .then((parsed) => {
      if (parsed["error"]) {
        auth.setAuthenticated(false);
        document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        return false;
      }
      if (parsed["user"]) {
        if (user === null) {
          const cookie =
            "user=" +
            parsed["user"] +
            "; max-age=" +
            30 * 24 * 60 * 60 +
            "; SameSite=Strict;";
          document.cookie = cookie;
        }

        auth.setAuthenticated(true);

        return true;
      } else {
        auth.setAuthenticated(false);
        document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
        if (auth.isAuthenticated() === true) {
          return <Component {...rest} />;
        } else if (document.cookie !== null) {
          const auth = decode();

          return auth === true ? <Component {...rest} /> : <Redirect to="/" />;
        } else {
          return <Redirect to="/" />;
        }
      }}
    />
  );
};
