import React from "react";
import "./SearchedUserRec.css";

export const SearchedUserRec = (props) => {
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div className="searched-user-rec">
      <div className="searched-profile-card-header">
        <ul>
          <li>
            <p>{"Likes: " + props.likes}</p>
          </li>
        </ul>
      </div>
      <div className="loading-spinner searched-user-rec-div">
        <iframe
          onLoad={() => {
           const arr = document.getElementsByClassName("searched-user-rec-div")
           for(let i=0; i<arr.length;i++){
             
             arr[i].style.backgroundImage='none';
           
          }}}
          src={url}
          width="600"
          height="300"
          frameBorder="1"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
        <h3>{'Created on: ' + props.date}</h3>
      </div>
    </div>
  );
};
