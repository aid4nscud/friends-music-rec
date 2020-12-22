import React from "react";
import { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import { FeedRec } from "../FeedRec/FeedRec";
import { SearchUser } from "../SearchUser/SearchUser";
import './FriendRecs.css'

export const FriendRecs = (props) => {
  const [recs, setRecs] = useState(null);
  const [index, setIndex] = useState(0);
  const [followButton, setFollowButton] = useState("Following");
  const [render, setRender] = useState(0)


  useEffect(() => {
    
    const user = getCookie("user");

    if (user !== null) {
      const url = "/api/get_friend_recs";
      const data = {user: user}
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            setRecs(parsedJSON["recs"]);
          }
        });
    } else {
      const url = "/api/get_friend_recs"
      const data = {user: getCookie('user')}
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((parsedJSON) => {
          
          if (parsedJSON["recs"].length > 0) {
            setRecs(parsedJSON["recs"]);
            
          }
        });
    }
  }, [render]);

  const follow = (userToFollow) => {
    const userFollowing = getCookie("user");

    const data = {
      userToFollow: userToFollow,
      userFollowing: userFollowing,
    };
    fetch("/api/follow_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.success) {
         setFollowButton("Following")
        }
      });

      setRender(render+1)
  };

  const unfollow = (userToUnfollow) => {
    const userUnfollowing = getCookie("user");

    const data = {
      userToUnfollow: userToUnfollow,
      userUnfollowing: userUnfollowing,
    };
    fetch("/api/unfollow_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.success) {
          setFollowButton("Follow");
        }
      });
      setRender(render+1)
  }

  const nextRec = () => {
    {
      const currIndex = index == recs.length - 1 ? 0 : index + 1;

      setIndex(currIndex);
      setFollowButton('Following')
    }
    setRender(render+1)
  };

  function likeRec(recToLike) {
    const userLiking = getCookie("user");

    const data = {
      recToLike: recToLike,
      userLiking: userLiking,
    };
    fetch("/api/like_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (!parsed.success) {
          return alert('error')
    
        }

      });
      
  }

  function unlikeRec(recToUnlike) {
    const userUnliking = getCookie("user");

    const data = {
      recToUnlike: recToUnlike,
      userUnliking: userUnliking,
    };

    fetch("/api/unlike_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
   
  }

  return (
    <div className='friend-recs'>
      {recs === null ? (
        <h2 style={{color:'black'}}>When you have friends, their recommendations will show up here</h2>
      ) : (
        <div>
          <h1 style={{color:'black'}}>Listen to what your friends recommend!</h1>
          <FeedRec
            liked={recs[index].liked}
            likes = {recs[index].likes}
            like={likeRec}
            unlike={unlikeRec}
            follow={follow}
            id={recs[index]._id}
            user={recs[index].user}
            spotifyToken={props.spotifyToken}
            setSpotifyToken={props.setSpotifyToken}
            images={recs[index].images}
            song={recs[index].song}
            artist={recs[index].artist}
            uri={recs[index].uri}
            nextRec={nextRec}
            unfollow={unfollow}
            followButton={followButton}
            render = {render} setRender={setRender}
          />
        </div>
      )}

      <SearchUser render = {render} setRender={setRender}/>
    </div>
  );
};
