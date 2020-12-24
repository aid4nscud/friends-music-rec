import React from "react";
import { useState } from "react";
import "./FeedRec.css";
import { useHistory } from "react-router-dom";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";
import { GrLinkNext } from "react-icons/gr";

export const FeedRec = (props) => {
  const [likes, setLikes] = useState(0);
  const history = useHistory();
  let uri = props.recInfo.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div className="feed-rec-container">
      <div className="feed-rec">
        <div className="feed-rec-card-header">
          <div className="user-info">
            <h3 className="rec-desc">
              Recommended by{" "}
              <span
                onClick={() => {
                  const url = "/app/profile/" + props.recInfo.user;

                  history.push(url);
                }}
                className="span-recommender"
              >
                {props.recInfo.user}
              </span>
            </h3>
            {props.followButton === "Following" ? (
              <button
              style={{backgroundColor:'white',color:'black'}}
                className="feed-rec-follow-button"
                onClick={() => {
                  props.unfollow(props.recInfo.user);
                }}
              >
                <b>{props.followButton}</b>
              </button>
            ) : (
              <button
                onClick={() => {
                  props.follow(props.recInfo.user);
                }}
                className="feed-rec-follow-button"
              >
                <b>{props.followButton}</b>
              </button>
            )}
          </div>
          <div className="rec-info">
            <div
              className="like-icon"
              onClick={() => {
                
                if (props.recInfo.liked === true) {
                  props.unlike(props.recInfo._id);
                  

                  props.setRender(props.render + 1);
                }
                if (props.recInfo.liked === false) {
                  props.like(props.recInfo._id);

                  props.setRender(props.render + 1);
                }
              }}
            >
              {props.recInfo.liked === true ? <LikedHeart /> : <UnlikedHeart />}
            </div>

            <h3 className="feed-likes-label">
              {"Likes: " + props.recInfo.likes}
            </h3>
          </div>
        </div>
        <div className="loading-spinner">
          <iframe
            onLoad={() => {
              const arr = document.getElementsByClassName("loading-spinner");
              for (let i = 0; i < arr.length; i++) {
                arr[i].style.backgroundImage = "none";
              }
            }}
            className="feed-rec-iframe"
            src={url}
            width="500"
            height="500"
            frameBorder="1"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        </div>

        <h3 style={{width: "20%", margin: "2rem", position:'relative', bottom:'1rem'}}>
          {props.recInfo.date.substring(0, 3) +
            ", " +
            props.recInfo.date.substring(4)}
        </h3>
      </div>
      <div style={{position:'relative', bottom:'2rem'}} className="next-button" onClick={props.nextRec}>
        <GrLinkNext style={{ padding: "0.5rem" }} size="2em" />
      </div>
    </div>
  );
};
