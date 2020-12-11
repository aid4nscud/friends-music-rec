import React, { useState, useEffect } from "react";
import "./Discover.css";
import { DiscoverRec } from "../DiscoverRec/DiscoverRec";
import { getCookie } from "../../utils/auth";

export const Discover = (props) => {
  const [index, setIndex] = useState(0);
  const [recs, setRecs] = useState(null);
  const [followButton, setFollowButton] = useState("Follow");
  const [recInfo, setRecInfo] = useState(null);
  const [render, setRender] = useState(0)
  const [liked, setLiked] = useState(null)

  useEffect(() => {
    const data = { user: getCookie("user") };
    if (data["user"] !== null) {
      const url = "/api/get_discover_recs";
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((parsedJSON) => {
          if (parsedJSON["recs"].length > 0) {
            console.log(parsedJSON['recs'])
            setRecs(parsedJSON["recs"]);

            let recinfo = {
              likes: parsedJSON["recs"][index].likes,
              id: parsedJSON["recs"][index]._id,
              user: parsedJSON["recs"][index].user,
              images: parsedJSON["recs"][index].images,
              song: parsedJSON["recs"][index].song,
              artist: parsedJSON["recs"][index].artist,
              uri: parsedJSON["recs"][index].uri,
              liked: parsedJSON['recs'][index].liked
            };
          
            setRecInfo(recinfo)
          }
          
        });
    }
  }, [render]);



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
      
  }

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
          setFollowButton("Following");
        }
      });
  };

  const nextRec = () => {
    if (index !== recs.length - 1) {
      setIndex(index + 1);
      setFollowButton("Follow");

      setRender(render+1)
    } else if (index == recs.length - 1 && recs.length > 1) {
      setIndex(0);
      setFollowButton("Follow");
      
      setRender(render+1)
    }
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
          setLiked(true)
  
        }
        else if(parsed.error) {
          alert('some error occurred')
        }
      });
      setRender(render+1)
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
    setRender(render+1)
  }

  return (
    <div key={render}className="discover">
      <h1>Explore Recommendations!</h1>

      <div className="rec-section">
        {recs === null ? (
          <h1>No recs rn G</h1>
        ) : (
          <div>
            {recs && recInfo !== null && (
              <DiscoverRec
              render = {render}
              setRender = {setRender}
                unlikeRec={unlikeRec}
                recInfo={recInfo}
                spotifyToken={props.spotifyToken}
                setSpotifyToken={props.setSpotifyToken}
                like={likeRec}
                nextRec={nextRec}
                unfollow={unfollow}
                follow={follow}
                followButton={followButton}
                liked={liked}
                
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
