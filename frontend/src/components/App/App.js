import React from "react";

import { Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import { getCookie } from "../../utils/auth";
import { Login } from "../Login/Login.js";
import { Register } from "../Register/Register";
import { AuthRoute } from "../AuthRoute";
import { AppLayout } from "../AppLayout/AppLayout.js";

function App() {
  const history = useHistory();
  document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

  return (
    <div className="App">
      <Switch>
      <Route
        exact
        path="/register"
        render={() => {
          const token = getCookie("token");
          if (token !== null) {
            history.push("/app");
          } else {
            return <Register />;
          }
        }}
      />

      <Route
        exact
        path="/"
        render={() => {
          const token = getCookie("token");
          if (token !== null) {
            history.push("/app");
          } else {
            return <Login />;
          }
        }}
      />

      <AuthRoute path="/app" component={AppLayout} />
      </Switch>
      
    </div>
  );
}

export default App;
