import "./QueuedRec.css";
import React, { useState, useEffect } from "react";
import { getCookie } from "../../utils/auth";
import { FriendSearch } from "../FriendSearch/FriendSearch";

export const QueuedRec = (props) => {
  const [recType, setRecType] = useState(true);
  const [backgroundColor1, setBackgroundColor1] = useState(
    "rgba(0, 0, 0, 0.53)"
  );
  const [color1, setColor1] = useState("white");
  const [backgroundColor2, setBackgroundColor2] = useState("white");
  const [color2, setColor2] = useState("rgba(0, 0, 0, 0.53)");

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

  const createRec = () => {
    const recommender = getCookie("user");

    const rec = {
      song: props.info.song,
      artist: props.info.artist,
      user: recommender,
      uri: props.info.uri,
    };
    fetch("/api/create_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec),
    })
      .then((res) => res.json())
      .then((parsed) => {
        console.log(parsed);
        if (parsed["error"]) {
          alert(parsed["error"]);
        }
        if (parsed["success"]) {
          props.cleanup();
        }
      });
  };

  const createDirectRec = (friends, caption) => {
    const recommender = getCookie("user");

    const directRec = {
      song: props.info.song,
      artist: props.info.artist,
      user: recommender,
      uri: props.info.uri,
      recipients: friends,
      caption: caption,
    };

    fetch("/api/create_direct_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(directRec),
    })
      .then((res) => res.json())
      .then((parsed) => {
        console.log(parsed);
        if (parsed["error"]) {
          alert(parsed["error"]);
        }
        if (parsed["success"]) {
          props.cleanup();
          alert("Recommendation Successful");
        }
      });
  };

  return (
    <div className="queued-rec">
      <div className="rec-preview">
        <iframe
          style={{
            borderRadius: "2rem 0 2rem 2rem",
            borderColor: "ffffff",
          }}
          className="queued-iframe"
          src={props.info.url}
          width="90%"
          height="450"
          frameBorder="1"
          allowtransparency="false"
          allow="encrypted-media"
        ></iframe>
      </div>

      <div className="make-rec-options">
        <h2>Create Recommendation</h2>

        <ul className="toggle-rectype">
          <button
            id="tog-rectype1"
            style={{
              backgroundColor: backgroundColor1,
              color: color1,
            }}
            onClick={(e) => {
              setRecType(true);
            }}
          >
            Public
          </button>
          <button
            id="tog-rectype2"
            style={{
              backgroundColor: backgroundColor2,
              color: color2,
            }}
            onClick={(e) => {
              setRecType(false);
            }}
          >
            Direct
          </button>
        </ul>

        {recType === false && (
          <FriendSearch createDirectRec={createDirectRec} />
        )}
        {recType === true && (
          <h2 style={{ display: "block" }}>
            Recommend to your followers, and anonymously to the world
          </h2>
        )}
        {recType === true && (
          <button
            className="make-rec-button"
            onClick={() => {
              createRec();
            }}
          >
            Make Recommendation!
          </button>
        )}
      </div>
    </div>
  );
};
