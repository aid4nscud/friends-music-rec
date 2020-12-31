import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import auth from "../../utils/auth";
import "./Register.css";

export const Register = (props) => {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const history = useHistory();

  const register = (email, username, password) => {
    const user = {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: password.toLowerCase(),
    };
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if(parsed.error){
          console.log(parsed.error)
          alert('error')
        }
        if (parsed.success) {
          setTimeout(2);
          const creds = {
            username: username.toLowerCase(),
            password: password.toLowerCase(),
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
                  "token=" + parsed["token"] + "; max-age=" + 30 * 24 * 60 * 60;
                document.cookie = cookie;
                if (parsed.user) {
                  const cookie =
                    "user=" +
                    parsed.user +
                    "; max-age=" +
                    30 * 24 * 60 * 60 +
                    "; SameSite=Strict";
                  document.cookie = cookie;
                }

                auth.login(() => {
                  history.push("/app/listen");
                });
              } else {
                alert(parsed.error);
              }
            });
        }
      });
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if ((email, username, password !== null)) {
            register(email, username, password);
          } else {
            alert("All fields must be filled out");
          }
        }}
        className="register-form"
      >
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          placeholder="EMAIL"
        ></input>
        <input
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
          placeholder="USERNAME"
        ></input>
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          placeholder="PASSWORD"
        ></input>
        <button className='login-page-button' type="submit">Create Account!</button>
      </form>
      <h2 style={{color:'black'}}>Already have an account?</h2>
            <button className='login-page-button'
              onClick={() => {
                props.setRegister(false);
                // history.push("/register");
              }}
            >
              Login!
            </button>
    </div>
  );
};
