import React from "react";

import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import auth, { getCookie } from "../../utils/auth";
import { Login } from "../Login/Login.js";
import { Register } from "../Register/Register";
import { AuthRoute } from "../AuthRoute";
import { AppLayout } from "../AppLayout/AppLayout.js";

function App() {
  const history = useHistory();

  return (
    <div className="App">
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            if (getCookie("token") !== null || auth.isAuthenticated() || getCookie("user") !== null) {
              history.push("/app/listen");
            } else {
              return <Login />;
            }
          }}
        />

        <AuthRoute path="/app" component={AppLayout} />
        <Route path='*'>
          <Redirect to='/'/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
