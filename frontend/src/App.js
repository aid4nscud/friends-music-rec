import React from "react";
import axios from "axios";
import {Redirect, Route, useHistory} from "react-router-dom";
import "./App.css";
import auth, {getCookie} from './auth'
import { Login } from "./Login.js";
import { Register } from "./Register";
import { AuthRoute } from "./AuthRoute";
import { AppLayout } from "./AppLayout.js";



function App(props) {

  const history = useHistory()

  return (
    <div className="App">

      <Route exact path="/"  render={()=>{
        const token = getCookie('token')
        if (token !== null) {
          history.push('/app');
        }
        else {
          return <Login/>
        }

      }}/>

      <AuthRoute path="/app" component={AppLayout} />

    </div>
  );
}

export default App;
