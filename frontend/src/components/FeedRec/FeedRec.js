import React from "react";
import { useState } from "react";
import "./FeedRec.css";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";

export const FeedRec = (props) => {
  const [likes, setLikes] = useState(0);

  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;



  return (
    <div className="container">
      <div className="feed-rec">
        <div className="card-header">
          <div className="user-info">
            <h3 className="rec-desc">
              Recommended by{" "}
              <span className="span-recommender">{props.user}</span>
            </h3>
            {props.followButton === "Following" ? (
              <button
                className="unfollow-button"
                onClick={() => {
                  props.unfollow(props.user);
                }}
              >
                {props.followButton}
              </button>
            ) : (
              <button onClick={() => {
                props.follow(props.user);
              }} className="follow-button">{props.followButton}</button>
            )}
          </div>
          <div className="rec-info">
            <div
              className="like-icon"
              onClick={() => {
              
                if(props.liked === true){
                  props.unlike(props.id)
                  
                  props.setRender(props.render +1)
                }
                if(props.liked===false){
                  props.like(props.id)
                  
                  props.setRender(props.render + 1)
                }
              }}
            >
              {props.liked === true ? <LikedHeart /> : <UnlikedHeart />}
            </div>

            <h3 className="likes-label">{"Likes: " + (props.likes)}</h3>
          </div>
        </div>
        <div className='loading-spinner'>
        <iframe
        onLoad={() => {
          const arr = document.getElementsByClassName("loading-spinner")
          for(let i=0; i<arr.length;i++){
            
            arr[i].style.backgroundImage='none';
          
         }}}
          className="feed-rec-iframe"
          src={url}
          width="500"
          height="500"
          frameBorder="1"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
        </div>
        <div className="next-button-container">
        <button className="next-button" onClick={props.nextRec}>
          Next
        </button>
      </div>
        
      </div>
      
    </div>
  );
};
