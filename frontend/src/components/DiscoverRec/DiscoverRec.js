import React, { useEffect, useState } from "react";
import "./DiscoverRec.css";

export const DiscoverRec = (props) => {
 const [likes, setLikes] = useState(0)
  let uri = props.uri;
  let uriCode = uri.substr(14);
  let url = "https://open.spotify.com/embed/track/" + uriCode;


  return (
    <div className="discover-rec">
      <iframe
        className="discover-rec-iframe"
        src={url}
        width="500"
        height="500"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>

      <div className="card-footer">
        {props.liked === false ? <button
          className="like-button"
          onClick={() => {
            props.like(props.id)
            setLikes(likes+1)
            props.setLiked(true)
          }}
        >
          Like
        </button> : <h3
          className="liked"
        >
          Liked!
        </h3>}
        

        <h3>{"Likes: " + (props.likes + likes)}</h3>

        <p
          className="more-info"
          onClick={() => {
            return props.moreInfo
              ? props.setMoreInfo(false)
              : props.setMoreInfo(true);
          }}
        >
          More Info
        </p>

        {props.moreInfo && (
          <div className="more-info-desc">
            <p>
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
                <button className="following-button">
                  {props.followButton}
                </button>
              )}
            </p>
          </div>
        )}
      </div>

      <button className="next-button " onClick={()=> {
        setLikes(0);
        props.nextRec()}}>
        Next{" "}
      </button>
    </div>
  );
};
