import React, { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const login = (username, password) => {

    const creds = {
      username: username,
      password: password,
    };
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    }).then(res => res.json()).then((parsed) => alert(parsed.message));
  };

  return (
    <div>
      <h1>Login</h1>
      <p>This page is where the user can sign in or sign up using one of the forms below</p>
      <form
        onSubmit={(e) => {
         
          if(username, password !== null){
            login(username, password);
          }
          else{
              alert('Fill out all fields')
          }
          
        }}
      >
        <input
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="USERNAME" value={username}
        ></input>
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="PASSWORD"
          type="password" value={password}
        ></input>
        <button type="submit"> Login </button>
      </form>
    </div>
  );
};
