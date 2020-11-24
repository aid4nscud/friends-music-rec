import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import auth from "../../utils/auth";
import "./Login.css";

export const Login = (props) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [warning, setWarning] = useState(null);
  const history = useHistory();

  const login = async (username, password) => {
    const creds = {
      username: username,
      password: password,
    };

    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.token) {
          const cookie =
            "token=" +
            parsed["token"] +
            "; max-age=" +
            30 * 24 * 60 * 60 +
            "; SameSite=Strict";
          document.cookie = cookie;

          auth.login(() => {
            history.push("/app/recommend");
          });
        } else {
          setWarning(parsed["error"]);
        }
      });
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <p>
        This page is where the user can sign in or sign up using one of the
        forms below
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if ((username, password !== null)) {
            login(username, password);
          } else {
            alert("Fill out all fields");
          }
        }}
        className="login-form"
      >
        <input
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="USERNAME"
          value={username}
        ></input>
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="PASSWORD"
          type="password"
          value={password}
        ></input>
        <button type="submit"> Login </button>
      </form>
      {warning && <h3 className="warning">{warning}</h3>}
      <div className="sign-up">
        <h2>Don't have an account yet?</h2>
        <button
          onClick={() => {
            history.push("/register");
          }}
        >
          Sign up!
        </button>
      </div>
    </div>
  );
};
