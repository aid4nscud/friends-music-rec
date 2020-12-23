import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import auth from "../../utils/auth";
import "./Login.css";
import image from "../../assets/login-guitar-picture.jpg";
import { Register } from "../Register/Register";

export const Login = (props) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [warning, setWarning] = useState(null);
  const [register, setRegister] = useState(false)
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
            parsed.token +
            "; max-age=" +
            30 * 24 * 60 * 60 +
            "; SameSite=Strict; ";
          document.cookie = cookie;

          if (parsed.user) {
            const cookie2 =
              "user=" +
              parsed.user +
              "; max-age=" +
              30 * 24 * 60 * 60 +
              "; SameSite=Strict;";
            document.cookie = cookie2;
          }
          // const url  = parsed.url

          auth.login(() => {
            history.push("/app/listen");
          });
        } else {
          setWarning(parsed.error);
        }
      });
  };

  return (
    <div className="container">
      <div className="main-message">DON'T KEEP GOOD MUSIC A SECRET</div>
      <div className="login-image">
        <img alt="skateboarder" src={image}></img>
      </div>
      {register === true ? (
        <Register setRegister={setRegister} />
      ) : (
        <div className="login">
          <h1>Login</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if ((username, password !== null)) {
                login(username, password);
              } else {
                setWarning("Fill out all fields");
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
                setRegister(true);
                
              }}
            >
              Sign up!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
