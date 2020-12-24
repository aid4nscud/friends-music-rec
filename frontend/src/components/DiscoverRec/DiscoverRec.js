import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";
import "./DiscoverRec.css";
import { GrLinkNext } from "react-icons/gr";

export const DiscoverRec = (props) => {
  const [likes, setLikes] = useState(0);
  const [placeholderLiked, setPlaceholderLiked] = useState(false);
  const history = useHistory();
  let uri = props.recInfo.uri;
  let uriCode = uri.substr(14);
  let url = "https://open.spotify.com/embed/track/" + uriCode;

  
  return (
    <div className="container-div">
      <h1 style={{ color: "black" }}>Explore Recommendations!</h1>
      <div className="discover-rec">
        <div className="card-header">
          {props.recInfo && (
            <div
              style={{
                float: "left",
                marginLeft: "3rem",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
              onClick={() => {
                if (props.recInfo.liked === false) {
                  props.like(props.recInfo._id);
                  setLikes(likes + 1);
                  setPlaceholderLiked(true);
                }
              }}
            >
              {props.recInfo.liked === true || placeholderLiked === true ? (
                <LikedHeart />
              ) : (
                <UnlikedHeart />
              )}
            </div>
          )}

          {(props.recInfo.liked === true || placeholderLiked === true) && (
            <h3 className="likes-number">
              {"Likes: " + (props.recInfo.likes + likes)}
            </h3>
          )}

          {(props.recInfo.liked === true || placeholderLiked === true) && (
            <div className="more-info-desc">
              <h3>
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
                {props.followButton === "Follow" ? (
                  <button
                    className="discover-rec-follow-button"
                    onClick={() => {
                      props.follow(props.recInfo.user);
                    }}
                  >
                    <b>{props.followButton}</b>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      props.unfollow(props.recInfo.user);
                    }}
                    style={{backgroundColor:'white', color:'black'}}
                    className="discover-rec-follow-button"
                  >
                    <b>{props.followButton}</b>
                  </button>
                )}
              </h3>
            </div>
          )}
        </div>
        <div className="loading-spinner">
          <iframe
            id="iframe-test"
            onLoad={() => {
              const arr = document.getElementsByClassName("loading-spinner");
              for (let i = 0; i < arr.length; i++) {
                arr[i].style.backgroundImage = "none";
              }
            }}
            className="discover-rec-iframe"
            src={url}
            width="100%"
            height="400"
            frameBorder="1"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        </div>
        <h3 style={{width:'20%', marginLeft:'2rem'}}>
          {props.recInfo.date.substring(0, 3) + ", " + props.recInfo.date.substring(4)}
        </h3>

        <div
        
          className="next-button"
          onClick={() => {
            setLikes(0);
            props.nextRec();
            setPlaceholderLiked(false)
          }}
        >
          <GrLinkNext color='white'style={{ padding: "0.5rem" }} size="2em" />
        </div>
        
      </div>
    </div>
  );
};
