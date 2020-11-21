import React from "react";
import axios from "axios";
import {Route} from "react-router-dom";
import "./App.css";

import { Login } from "./Login.js";
import { Register } from "./Register";
import { AuthRoute } from "./AuthRoute";
import { AppLayout } from "./AppLayout.js";


function App(props) {


  return (
    <div className="App">

      <Route exact path="/" component={Login} />

      <AuthRoute path="/app" component={AppLayout} />

    </div>
  );
}

export default App;
