import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";

export const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        
        return auth.isAuthenticated() === true ? <Component /> : <Redirect to='/'/> ;
        
        // else {
        //     return props.history.push('/');

        // }
      }}
    />
  );
};
