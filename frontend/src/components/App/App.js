import React from "react";

import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import auth, { clearCookies, getCookie } from "../../utils/auth";
import { Login } from "../Login/Login.js";
import { AuthRoute } from "../AuthRoute";
import { AppLayout } from "../AppLayout/AppLayout.js";
import { Footer } from "../Footer/Footer";

function App() {
  const history = useHistory();

  return (
    <div className="App">
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            const authed = auth.isAuthenticated();

            if (authed === true) {
              history.push("/app/listen");
            }
            // else if (
            //   getCookie("user") !== null &&
            //   getCookie("token") !== null
            // ) {
            //   console.log(document.cookie);

            //   history.push("/app/listen");
            // }
            else if (authed === false) {
              clearCookies();
              return <Login />;
            } else {
              return <Login />;
            }
          }}
        />

        <AuthRoute path="/app" component={AppLayout} />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
