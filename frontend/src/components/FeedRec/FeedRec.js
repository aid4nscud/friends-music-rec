import React from "react";
import { useState } from "react";
import { getCookie } from "../../utils/auth";
import "./FeedRec.css";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";

export const FeedRec = (props) => {
  const [likes, setLikes] = useState(props.likes);

  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  function likeRec(recToLike) {
    const userLiking = getCookie("user");

    const data = {
      recToLike: recToLike,
      userLiking: userLiking,
    };
    fetch("/api/like_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        // if (!parsed.success) {

        // }
        props.setLiked(true);
      });
  }

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
              <button className="follow-button">{props.followButton}</button>
            )}
          </div>
          <div className="rec-info">
            <div
              className="like-icon"
              onClick={() => {
                if (props.liked === false) {
                  likeRec(props.id);
                  setLikes(likes + 1);
                }
              }}
            >
              {props.liked === true ? <LikedHeart /> : <UnlikedHeart />}
            </div>

            <h3 className="likes-label">{"Likes: " + likes}</h3>
          </div>
        </div>
        <div className='loading-spinner'>
        <iframe
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
