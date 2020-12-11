import React, { useEffect, useState } from "react";
import { ReactComponent as LikedHeart } from "../../src/assets/liked-heart.svg";
import { ReactComponent as UnlikedHeart } from "../../src/assets/unliked-heart.svg";

export const HeartIcon = (props) => {
const [render, setRender] = useState(0)

  return (
    <div style={{float:'left', marginLeft:'3rem', marginTop: '2rem', marginBottom: '1rem'}}
      onClick={() => {
        if (props.liked === false) {
          props.like(props.recId);
          props.setLikes(props.likes + 1);
        
        }
        //possibly premium feature

        // else if(props.liked === true) {
          
        //   props.unlike(props.recId)
        //   props.setLikes(props.likes-1)
          
        // }
        
      }}
    >
      {props.liked === true ? <LikedHeart />:<UnlikedHeart />}
    </div>
  );
};
