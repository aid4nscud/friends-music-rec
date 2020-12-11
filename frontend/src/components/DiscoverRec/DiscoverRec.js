import React, {useState } from "react";
import { useHistory } from "react-router-dom";
import { HeartIcon } from "../HeartIcon";
import "./DiscoverRec.css";

export const DiscoverRec = (props) => {
  const [likes, setLikes] = useState(0);
  const history = useHistory();
  let uri = props.recInfo.uri;
  let uriCode = uri.substr(14);
  let url = "https://open.spotify.com/embed/track/" + uriCode;

  return (
    <div id="container-div" className="discover-rec">
      <div className="card-header">
        {props.recInfo && (
          <HeartIcon
            like={props.like}
            recId={props.recInfo.id}
            setLikes={setLikes}
            likes={likes}
            liked={props.recInfo.liked}
          />
        )}

        {props.recInfo.liked === true && (
          <h3 className="likes-number">
            {"Likes: " + (props.recInfo.likes + likes)}
          </h3>
        )}

        {props.recInfo.liked === true && (
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
                  className="follow-button"
                  onClick={() => {
                    props.follow(props.recInfo.user);
                  }}
                >
                  {props.followButton}
                </button>
              ) : (
                <button onClick={()=> {
                  props.unfollow(props.recInfo.user)
                }}className="following-button">
                  {props.followButton}
                </button>
              )}
            </h3>
          </div>
        )}
      </div>
      <div className="loading-spinner">
        <iframe
          onLoad={() => {
            const arr = document.getElementsByClassName("loading-spinner");
            for (let i = 0; i < arr.length; i++) {
              arr[i].style.backgroundImage = "none";
            }
          }}
          className="discover-rec-iframe"
          src={url}
          width="500"
          height="500"
          frameBorder="1"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
      </div>

      <button
        className="next-button"
        onClick={() => {
          setLikes(0);
          props.nextRec();
        }}
      >
        Next{" "}
      </button>
    </div>
  );
};
