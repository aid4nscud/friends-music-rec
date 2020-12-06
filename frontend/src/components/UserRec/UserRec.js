import React from "react";
import "./UserRec.css";

export const UserRec = (props) => {
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div className="user-rec">
      <div className="profile-card-header">
        <ul>
          <li>
          <button
          onClick={() => {
            props.deleteRec(props.song);
          }}
        >
          Remove
        </button>
          </li>
          <li>
          <p>{"Likes: " + props.likes}</p>

          </li>
        </ul>
        
       
      </div>

      <iframe className='profile-iframe'
        src={url}
        width="500"
        height="300"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
    </div>
  );
};
