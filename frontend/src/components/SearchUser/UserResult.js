import React, { useDebugValue, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthRoute } from "../AuthRoute";
import { SearchedProfile } from "../SearchedProfile/SearchedProfile";
import "./UserResult.css";

export const UserResult = (props) => {
  const [isFollowing, setIsFollowing] = useState(props.info.isFollowing);
  const [followButton, setFollowButton] = useState("Follow");
  const [backgroundColor,setBackgroundColor] = useState('black')
  const [color, setColor] = useState('white')
  
  const history = useHistory();

  useEffect(() => {
    
    if (isFollowing === true) {
      setFollowButton("Following");
      setBackgroundColor('white')
      setColor('black')

      
      
      
    } else {
      setFollowButton("Follow");
      setBackgroundColor('black')
      setColor('white')
      
     
    }
  });

  return (
    <div className="user-result">
      <h3
        onClick={() => {
          const url = "/app/profile/" + props.info.username;

          history.push(url);
        }}
        className="username"
      >
        <span
          className="user-result-span"
          style={{ backgroundColor: "black", borderRadius: "1rem" }}
        >
          {props.info.username}
        </span>
      </h3>

      {props.searcher !== props.info.username  && (
        <button
        style={{backgroundColor:backgroundColor, color: color}}
        id="user-result-follow-button"
          
          onClick={(e) => {
            if (isFollowing === true) {
              props.unfollow(props.info.username);
              setIsFollowing(false);
              e.target.innerHTML = "Follow";
            } else {
              props.follow(props.info.username);
              setIsFollowing(true);
              e.target.innerHTML = "Following";
            }
          }}
         
          className="user-result-follow-button"
        >
          {followButton !== null && followButton}
        </button>
      )}
    </div>
  );
};
