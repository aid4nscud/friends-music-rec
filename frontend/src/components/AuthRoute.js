import React, { useEffect, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import auth from "../utils/auth";
import { getCookie } from "../utils/auth";

export const AuthRoute = ({ component: Component, ...rest }) => {
  const [authed, setAuthed] = useState(null);

  const decode = async () => {
    const token = getCookie("token");
    const user = getCookie("token");
    let authedFunc = async () => {
      let authVar = await fetch("/auth_decode", {
        headers: {
          Authorization: "Bearer " + token,
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((parsed) => {
          if (parsed["error"]) {
            auth.setAuthenticated(false);
            setAuthed(false);
            document.cookie =
              "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
          }
          if (parsed["user"]) {
            if (user === null && getCookie("user") === null) {
              const cookie =
                "user=" +
                parsed["user"] +
                "; max-age=" +
                30 * 24 * 60 * 60 +
                "; SameSite=Strict;";
              document.cookie = cookie;
            }

            auth.setAuthenticated(true);
            setAuthed(true);
          } else {
            document.cookie =
              "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
            auth.setAuthenticated(false);
            setAuthed(false);
          }
        });

      return authVar;
    };

    authedFunc();
  };

  useEffect(() => {
    decode();
  }, []);

  return (
    authed !== null && (
      <Route
        {...rest}
        render={() => {
          return authed === true ? (
            <Component {...rest} />
          ) : (
            <Redirect to="/" />
          );
        }}
      />
    )
  );
};
