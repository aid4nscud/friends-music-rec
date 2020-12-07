import React, { useEffect, useState } from "react";
import { HeartIcon } from "../HeartIcon";
import "./DiscoverRec.css";

export const DiscoverRec = (props) => {
 const [likes, setLikes] = useState(0)
  let uri = props.uri;
  let uriCode = uri.substr(14);
  let url = "https://open.spotify.com/embed/track/" + uriCode;


  return (
    <div className="discover-rec">
       <div className="card-header">
         <HeartIcon like={props.like} recId={props.id} setMoreInfo={props.setMoreInfo} setLikes={setLikes} likes={likes} setLiked={props.setLiked} liked={props.liked}/>
       
          
        {props.moreInfo && <h3 className='likes-number'>{"Likes: " + (props.likes + likes)}</h3>}
        

       

        {props.moreInfo && (
          <div className="more-info-desc">
            <h3>
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
            </h3>
          </div>
        )}
      </div>

      <iframe
        className="discover-rec-iframe"
        src={url}
        width="500"
        height="500"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>

     

      <button className="next-button " onClick={()=> {
        setLikes(0);
        props.nextRec()}}>
        Next{" "}
      </button>
    </div>
  );
};
