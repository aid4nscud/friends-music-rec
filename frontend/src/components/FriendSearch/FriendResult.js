import React, { useEffect, useState } from "react";
import './FriendResult.css'


export const FriendResult = (props) => {
  const [added, setAdded] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  useEffect(() => {
    if (added === true) {
      setBackgroundColor(" rgba(12, 224, 247, 0.404)");
    } else {
      setBackgroundColor("white");
    }
  });
  return (
    <div className='friend-result'
      style={{
       
        width: "100%",
        
        
        background: backgroundColor,
      }}
    >
      <h2 style={{ width: "60%" }}>{props.friend}</h2>

      {added === false && <button
        style={{ margin: "1rem", padding:'0.5rem', borderRadius:'1rem', width: '6rem' }}
        onClick={() => {
          setAdded(true);
          props.addFriend(props.friend);
          
        }}
      >
        Add
      </button>}
      {added ===true && <button
        style={{ margin: "1rem", padding:'1rem', borderRadius:'1rem', width:'6rem' }}
        onClick={() => {
          setAdded(false);
          props.deleteFriend(props.friend);
          
        }}
      >
        Remove
      </button>}
    </div>
  );
};
