import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import { FriendResult } from "./FriendResult";

export const FriendSearch = (props) => {
  const [friends, setFriends] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);
  const [render, setRender] = useState(0);

  useEffect(() => {
    const url = "/api/get_friends";
    const user = getCookie("user");

    const data = {
      user: user,
    };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        setFriends(parsed["friends"]);
        console.log(parsed["friends"]);
      });
  }, []);

  const addFriend = (friendName) => {
    let currState = addedFriends;
    if(currState.indexOf(friendName)===-1){
      currState.push(friendName);
    setAddedFriends(currState);
    setRender(render + 1);
    }

    
  };

  const deleteFriend = (friendName) => {
    let currState = addedFriends;
    let index = currState.indexOf(friendName);
    currState.splice(index,1);
    setAddedFriends(currState);
    setRender(render + 1);
  };

  return (
    <div style={{marginTop:'2rem'}}>
      <h3 style={{ color: "black" }}>Available Friends</h3>
      {friends.length > 0 ? (
        <ul
          style={{
            padding: "none",
            width: "100%",
            margin: "auto",
            maxHeight: "15rem",
            overflowY: "auto",
            borderStyle: "dashed",
            borderColor: "black",
            textAlign: "left",
            borderTopStyle:'hidden',
            borderBottomStyle:'hidden',
            
            
          }}
        >
          {friends.map((friend) => {
            return (
              <FriendResult
                addFriend={addFriend}
                deleteFriend={deleteFriend}
                friend={friend}
              />
            );
          })}
        </ul>
      ) : (
        <h2>
          You can only send direct recs to users that you both follow, and are
          followed by...
        </h2>
      )}

      {addedFriends.length > 0 && (
        <h2 style={{ display: "block" }}>
          {addedFriends.length < 2
            ? "Recommend to " + addedFriends[0]
            : "Recommend to " +
              addedFriends[0] 
              + ", and " + (addedFriends.length - 1) +
              " others"}
        </h2>
      )}

      {addedFriends.length > 0 && (
        <button
          onClick={() => {
            props.createDirectRec(addedFriends);
          }}
        >
          Make Recommendation
        </button>
      )}
    </div>
  );
};
