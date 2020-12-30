import React, { useEffect, useState } from "react";
import "./SearchedUserRec.css";
import { ReactComponent as LikedHeart } from "../../assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../assets/unliked-heart.svg";
import { useParams } from "react-router-dom";
import { getCookie } from "../../utils/auth";

export const SearchedUserRec = (props) => {
  const { user } = useParams();
  const [liked, setLiked] = useState(props.liked);
  const [likes, setLikes] = useState(0);
  const [time, setTime] = useState(null)
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;

  useEffect(()=> {

    let currTime = Date.now()/1000;
    let stored_time = props.date
    
    const time_dif = currTime-stored_time
    setTime(time_dif/60)

  
 
 
    }, [])

  return (
    <div className="searched-user-rec">
      <div className="searched-profile-card-header">
        {user !== getCookie("user") && (
          <div
            className="heart-container"
            onClick={() => {
              if (liked === true) {
                props.unlikeRec(props.recID);
                setLiked(false);
                setLikes(likes - 1);
              }
              if (liked === false) {
                props.likeRec(props.recID);
                setLiked(true);
                setLikes(likes + 1);
              }
            }}
          >
            {liked === true ? <LikedHeart /> : <UnlikedHeart />}
          </div>
        )}

        <h3 className="searched-rec-likes-label">{"Likes: " + (likes + props.likes)}</h3>
      </div>
      <div className="loading-spinner searched-user-rec-div">
        <iframe
          onLoad={() => {
            const arr = document.getElementsByClassName(
              "searched-user-rec-div"
            );
            for (let i = 0; i < arr.length; i++) {
              arr[i].style.backgroundImage = "none";
            }
          }}
          src={url}
          width="600"
          height="300"
          frameBorder="1"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
        <h3 style={{float:'left', position:'relative', left: '2rem'}}>{time !==null && Math.round(time) + ' minutes ago'}</h3>
      </div>
    </div>
  );
};
