import React from "react";

import { Route, useHistory } from "react-router-dom";
import "./App.css";
import { getCookie } from "../../utils/auth";
import { Login } from "../Login/Login.js";
import { Register } from "../Register/Register";
import { AuthRoute } from "../AuthRoute";
import { AppLayout } from "../AppLayout/AppLayout.js";

function App() {
  const history = useHistory();

  return (
    <div className="App">
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
    </div>
  );
}

export default App;