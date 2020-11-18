import React, { Component, useState, useEffect } from "react";

import UserService from "./services/user.service";

export const UserBoard = () => {
  
const [content, setContent] = useState('')

  
  
  useEffect(()=> {
    UserService.getUserBoard().then(
        response => {
          setContent(response.data)
        }

  )})

  
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
        </header>
      </div>
    );
  }
