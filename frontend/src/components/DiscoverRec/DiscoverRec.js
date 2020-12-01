import React, { useEffect, useState } from "react";
import "./DiscoverRec.css";

export const DiscoverRec = (props) => {
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div className="discover-rec">
      <div className ='card-header'>
        <ul>
          <li>
          <p className='more-info'
          onClick={() => {
            return props.moreInfo
              ? props.setMoreInfo(false)
              : props.setMoreInfo(true);
          }}
        >
          More Info
        </p>
          </li>
          {props.moreInfo && (<li>
          <p className="rec-desc">
            Recommended to you by{" "}
            <span className="span-recommender">{props.user}</span>
            {props.moreInfo && props.followButton === "Follow" ? (
              <button
                className="follow-button"
                onClick={() => {
                  props.follow(props.user);
                }}
              >
                {props.followButton}
              </button>
            ) : (
              <button className="follow-button" style={{ color: "deeppink" }}>
                {props.followButton}
              </button>
            )}
          </p>
            
            </li>
          
        )}
          
        </ul>
        
        
      </div>

      <iframe
        src={url}
        width="500"
        height="500"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>

      <button onClick={props.nextRec}>Next</button>
    </div>
  );
};
