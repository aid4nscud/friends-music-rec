import React, { useEffect, useState } from "react";

export const FriendResult = (props) => {
    const [added, setAdded] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState('white')
    useEffect(()=> {
      if(added === true){
        setBackgroundColor(' rgba(12, 224, 247, 0.404)')
      }
      else{
        setBackgroundColor('white')
      }
    })
  return (
    <div style={{padding:'1rem', width:'150%', margin:'auto', marginLeft:'-2.4rem',background: backgroundColor}}>
      <h2>{props.friend}</h2>
      {added===false && <button style={{margin:'1rem'}}
        onClick={() => {
          props.addFriend(props.friend);
        setAdded(true)
        }}
      >
        Add
      </button>}
    </div>
  );
};
