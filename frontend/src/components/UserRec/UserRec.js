import React, { useState, useEffect } from "react";
import "./UserRec.css";
import { FaMinusCircle } from "react-icons/fa";

export const UserRec = (props) => {
  let uri = props.uri;
  let uriCode = uri.substr(14);
  const [time, setTime] = useState(null)

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  useEffect(()=> {

    let currTime = Date.now()/1000;
    let stored_time = props.date
    
    const time_dif = currTime-stored_time
    setTime(time_dif/60)

  
 
 
    }, [])

  return (
    <div className="user-rec">
      <div className="profile-card-header">
        

        <h3 className="user-rec-likes-label">{"Likes: " + props.likes}</h3>
      </div>
      <div className="loading-spinner user-rec-div">
        <iframe
          onLoad={() => {
            const arr = document.getElementsByClassName("user-rec-div");
            for (let i = 0; i < arr.length; i++) {
              arr[i].style.backgroundImage = "none";
            }
          }}
          src={url}
          width="600"
          height="300"
          frameBorder="1"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
        <h3 style={{ position: "relative", left: "2rem", float: "left" }}>
        {time !==null && Math.round(time) + ' minutes ago'}
        </h3>
        <div
          className="remove-rec-icon"
          onClick={() => {
            props.deleteRec(props.uri);
          }}
        >
          <FaMinusCircle size="2em" color="white" />
        </div>
      </div>
    </div>
  );
};
