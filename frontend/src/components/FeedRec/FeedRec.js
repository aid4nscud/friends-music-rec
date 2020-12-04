import React from "react";
import './FeedRec.css'

export const FeedRec = (props) => {
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div className = 'container'>
    <div className="feed-rec">
      <div className='card-header'>
      <h3 className="rec-desc">
          Recommended to you by {" "}
          <span className="span-recommender">{ props.user}</span>
      </h3>
      {props.followButton === "Unfollow" ? (
              <button
                className="unfollow-button"
                onClick={() => {
                  props.unfollow(props.user);
                }}
              >
                {props.followButton}
              </button>
            ) : (
              <button className="follow-button" >
                {props.followButton}
              </button>
            )}
      </div>
      <iframe className='feed-rec-iframe'
        src={url}
        width="500"
        height="500"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      

      
    </div>
    <div className='next-button-container'>
      <button className = 'next-button' onClick={props.nextRec}>Next</button>
      </div>
    
    </div>
  );
};
