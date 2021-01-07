import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { FriendRecs } from "../FriendRecs/FriendRecs";
import { Discover } from "../Discover/Discover";
import "./MainRecs.css";
import { SearchUser } from "../SearchUser/SearchUser";
import { ActivityFeed } from "../ActivityFeed/ActivityFeed";
import { FaSearchengin } from "react-icons/fa";
import { getCookie } from "../../utils/auth";

export const MainRecs = (props) => {
  const [recType, setRecType] = useState(true);
  const [backgroundColor1, setBackgroundColor1] = useState(
    "rgba(0, 0, 0, 0.53)"
  );
  const [color1, setColor1] = useState("white");
  const [backgroundColor2, setBackgroundColor2] = useState("white");
  const [color2, setColor2] = useState("rgba(0, 0, 0, 0.53)");

  const [feedRecs, setFeedRecs] = useState(null);
  const [discoverRecs, setDiscoverRecs] = useState(null);
  const [directRecs, setDirectRecs] = useState(null);

  const searchUserRef = useRef();

  useEffect(() => {
    const user = getCookie("user");

    const url = "/api/get_friend_recs";
    const data = { user: user };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed["recs"].length > 0) {
          setFeedRecs(parsed["recs"]);
        } else {
          setFeedRecs(null);
        }
      });

    const url2 = "/api/get_direct_recs";

    const data2 = {
      user: user,
    };

    fetch(url2, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data2),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed["recs"].length > 0) {
          setDirectRecs(parsed["recs"]);
        } else {
          setDirectRecs(null);
        }

        if (parsed["error"]) {
          alert(parsed["error"]);
        }
      });

    const url3 = "/api/get_discover_recs";
    fetch(url3, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data2),
    })
      .then((res) => res.json())
      .then((parsedJSON) => {
        if (parsedJSON["recs"]) {
          console.log(parsedJSON["recs"]);
          setDiscoverRecs(parsedJSON["recs"]);
        }
      });
  }, [recType]);

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
      <div>
        <ul className="toggle-type">
          <button
            id="tog-button1"
            style={{
              backgroundColor: backgroundColor1,
              color: color1,
              borderTopLeftRadius: "1.3rem",
              borderBottomLeftRadius: "1.3rem",
            }}
            onClick={() => {
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
            onClick={() => {
              setRecType(false);
            }}
          >
            Explore
          </button>
        </ul>
        {recType === false && (
          <div
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginLeft: "3rem",
              marginTop: "1rem",
            }}
            onClick={() => {
              if (searchUserRef.current) {
                searchUserRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }
            }}
          >
            {" "}
            <h3
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                color: "black",
              }}
            >
              Search
            </h3>
            <FaSearchengin
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                padding: "1rem",
              }}
              color="black"
              size="3em"
              className="search-user-icon"
            />
          </div>
        )}
      </div>

      {recType !== null && (
        <div>
          {recType === true && (
            <div className="main-recs-friends">
              <div
                style={{
                  display: "inline-block",
                  width: "50%",
                  textAlign: "center",
                  marginTop: "3rem",
                }}
              >
                <FriendRecs
                  spotifyToken={props.spotifyToken}
                  setSpotifyToken={props.setSpotifyToken}
                  feedRecs={feedRecs}
                  directRecs={directRecs}
                />
              </div>

              <div className="recs-true-format">
                <ActivityFeed />
              </div>
            </div>
          )}

          {recType === false && discoverRecs !== null && (
            <div className="main-recs-explore">
              <Discover
                spotifyToken={props.spotifyToken}
                setSpotifyToken={props.setSpotifyToken}
                recs={discoverRecs}
              />
              <div ref={searchUserRef}>
                <SearchUser />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
