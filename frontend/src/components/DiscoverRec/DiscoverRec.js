import React from "react";
import './DiscoverRec.css'



export const DiscoverRec = (props) => {
  
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div className='feed-rec'>
      <iframe
        src={url}
        width="500"
        height="500"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <div>
      <h3 className='rec-desc'>Recommended to you by <span className='span-recommender'>{props.user}</span></h3>
      {props.followButton === 'Follow' ?  <button className='follow-button' onClick={()=> {
        props.follow(props.user);
      }}>{props.followButton}</button> : <button className='follow-button' style={{color: 'deeppink'}}>{props.followButton}</button>}
      </div>
      
     

      <button onClick={props.nextRec}>Next</button>
    </div>
  );
};
