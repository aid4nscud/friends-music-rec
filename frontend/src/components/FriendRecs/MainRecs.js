import React from "react";
import { useEffect, useState } from "react";
import { FeedRec } from "../FeedRec/FeedRec";
import { Discover } from "../Discover/Discover";
import "./MainRecs.css";
import { SearchUser } from "../SearchUser/SearchUser";
import { ActivityFeed } from "../ActivityFeed/ActivityFeed";

export const MainRecs = (props) => {
  const [recType, setRecType] = useState(true); //set to null and useeffect hook will set conditionally based on if there are any friendrecs
  const [backgroundColor1, setBackgroundColor1] = useState(
    "rgba(0, 0, 0, 0.53)"
  );
  const [color1, setColor1] = useState("white");
  const [backgroundColor2, setBackgroundColor2] = useState("white");
  const [color2, setColor2] = useState("rgba(0, 0, 0, 0.53)");
  const [recs, setRecs] = useState(null)


  useEffect(() => {
    if (recType === true) {
      setBackgroundColor1("white");
      setColor1("black");
      setBackgroundColor2("rgba(0, 0, 0, 0.53)");
      setColor2("white");
    } else {
      setBackgroundColor1("rgba(0, 0, 0, 0.53)");
      setColor1("white");
      setBackgroundColor2("white");
      setColor2("black");
    }
  }, [recType]);

  return (
    <div className="friend-recs">
      <ul className="toggle-type">
        <button
          id="tog-button1"
          style={{
            backgroundColor: backgroundColor1,
            color: color1,
            borderTopLeftRadius: "1.3rem",
            borderBottomLeftRadius: "1.3rem",
          }}
          onClick={(e) => {
            setRecType(true);
          }}
        >
          Friends
        </button>
        <button
          id="tog-button2"
          style={{
            backgroundColor: backgroundColor2,
            color: color2,
            borderTopRightRadius: "1.3rem",
            borderBottomRightRadius: "1.3rem",
          }}
          onClick={(e) => {
            setRecType(false);
          }}
        >
          Explore
        </button>
      </ul>

      {recType === true && (
        <div className='main-recs-friends'>
        <div style={{display:'inline-block', width:'50%', textAlign:'center', marginTop:'3rem'}}>
          <FeedRec
            
            spotifyToken={props.spotifyToken}
            setSpotifyToken={props.setSpotifyToken}
            recType={recType}
            setRecType={setRecType}
            setRecs={setRecs}
          />
          </div>
          <div className='recs-true-format'><ActivityFeed /></div>
        </div>
      )}
      {recType === false && (
        <div className='main-recs-explore'>
       
        <Discover
          spotifyToken={props.spotifyToken}
          setSpotifyToken={props.setSpotifyToken}
        />
        </div>
      )}
      
    </div>
  );
};
