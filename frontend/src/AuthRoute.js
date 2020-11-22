import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";
import axios from "axios";
import { getCookie } from "./auth";

export const AuthRoute = ({ component: Component, ...rest }) => {
  const [ load, setLoad] = useState(0)
  
  return (
    <Route
      {...rest}
      render={ () => {
        if(auth.isAuthenticated()){
          return <Component/>
        }
        else if(getCookie('token')!== null){
          let token = getCookie('token')
          axios("/auth_decode", {
            headers: {
              Authorization: "Bearer " + token,
            },
            method: "GET",
          }).then((res) => {
            if (res.data["user"]) {
              auth.setAuthenticated(true);
              setLoad(load+1) //FORCES REACT TO RERENDER PAGE 
            } else {
              return <Redirect to="/" />;
            }
          })

        }
        else {
          return <Redirect to="/" />
        }
        
      }}
    />
  );
};
