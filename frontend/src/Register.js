import React, { useState } from "react";


export const Register = () => {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const register = (email, username, password) => {
      const user = {
          email: email,
          username: username,
          password: password
      }
      fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }).then(res => res.json()).then((parsed) => alert(parsed.message));
    };
 

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={(e) => {
         
          if(email,username, password !== null){
          register(email, username, password)
          }
          else{
              alert('All fields must be filled out')
          }
          
          }}>
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
        <button type="submit">Create Account!</button>
      </form>
    </div>
  );
        }
