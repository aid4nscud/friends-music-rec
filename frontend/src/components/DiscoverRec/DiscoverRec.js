import React, { useState } from "react";
import { HeartIcon } from "../HeartIcon";
import "./DiscoverRec.css";

export const DiscoverRec = (props) => {
 const [likes, setLikes] = useState(0)

  let uri = props.recInfo.uri;
  let uriCode = uri.substr(14);
  let url = "https://open.spotify.com/embed/track/" + uriCode;




  return (
    <div id='container-div' className="discover-rec">
       <div className="card-header">
         {props.recInfo && <HeartIcon  like={props.like} recId={props.recInfo.id}  setLikes={setLikes} likes={likes}  liked={props.recInfo.liked}/>}
       
          
        {props.recInfo.liked===true && <h3 className='likes-number'>{"Likes: " + (props.recInfo.likes + likes)}</h3>}
        

       

        {props.recInfo.liked === true && (
          <div className="more-info-desc">
            <p>
              Recommended by{" "}
              <span className="span-recommender">{props.recInfo.user}</span>
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
                <button className="following-button">
                  {props.followButton}
                </button>
              )}
            </p>
          </div>
        )}
      </div>
<div className='loading-spinner'>
<iframe
        className="discover-rec-iframe"
        src={url}
        width="500"
        height="500"
        frameBorder="1"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
</div>
      

     

      <button className="next-button" onClick={()=> {
        setLikes(0);
        props.nextRec()}}>
        Next{" "}
      </button>
    </div>
  );
};
