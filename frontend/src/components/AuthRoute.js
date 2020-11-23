import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../utils/auth";
import axios from "axios";
import { getCookie } from "../utils/auth";

export const AuthRoute = ({ component: Component, ...rest }) => {
  const [ load, setLoad] = useState(0)
  
  return (
    <Route
      {...rest}
      render={ () => {
  
        if(getCookie('token')!== null){
          let token = getCookie('token')

          if(auth.getUser()===null){
            axios("/auth_decode", {
              headers: {
                Authorization: "Bearer " + token,
              },
              method: "GET",
            }).then((res) => {
              if (res.data["user"]) {
                
                  auth.setUser(res.data['user'])
                  auth.setAuthenticated(true);
                  setLoad(load+1)
                  //FORCES REACT TO RERENDER PAGE 
              } else {
                return <Redirect to='/'/>
              }
            })
          }
          else if(load===0){
            auth.setAuthenticated(true);
            setLoad(load+1)
          }
          else if(load !== 0){
            return <Component/>
          }

          

        }
        else {
          return <Redirect to="/" />
        }
        
      }}
    />
  );
};
