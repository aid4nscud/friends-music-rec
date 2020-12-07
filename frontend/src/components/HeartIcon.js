import React from "react";
import { ReactComponent as UnlikedHeart } from "../../src/liked-heart.svg";
import { ReactComponent as LikedHeart } from "../../src/unliked-heart.svg";

export const HeartIcon = (props) => {
  return (
    <div style={{float:'left', marginLeft:'3rem', marginTop: '2rem', marginBottom: '1rem'}}
      onClick={() => {
        if (props.liked === false) {
          props.setLiked(true);
          props.like(props.recId);
          props.setMoreInfo(true);
          props.setLikes(props.likes + 1);
          props.setLiked(true);
        }
      }}
    >
      {props.liked === true ? <UnlikedHeart /> : <LikedHeart />}
    </div>
  );
};
