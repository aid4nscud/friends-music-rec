import "./QueuedRec.css";
import React, { useState } from "react";
import { getCookie } from "../../utils/auth";

export const QueuedRec = (props) => {
  const [recType, setRecType] = useState("public");

  const createRec = () => {
    const recommender = getCookie("user");
    let date = Date.now();
    let setdate = new Date(date);
    setdate = setdate.toString().substring(0, 10);

    const rec = {
      song: props.info.song,
      artist: props.info.artist,
      user: recommender,
      images: props.info.images,
      uri: props.info.uri,
      date: setdate,
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
          console.log("rec succesfully added");
        }
      });
  };

  return (
    <div className="queued-rec">
      <div
        style={{
          textAlign: "left",
          background: "#111111",
          margin: "auto",
          borderRadius: "2rem",
          display: "inline-block",
        }}
        id="queued-div"
        className="queued-rec-card loading-spinner"
      >
        <iframe
          onLoad={() => {
            document.getElementById("queued-div").style.backgroundImage =
              "none";
          }}
          style={{
            borderRadius: "2rem 0 2rem 2rem",
            borderColor: "#111111",
          }}
          className="queued-iframe"
          src={props.info.url}
          width="99%"
          height="300"
          frameBorder="1"
          allowtransparency="false"
          allow="encrypted-media"
        ></iframe>
      </div>
      <div className="make-rec-options">
        <h2>Create Recommendation</h2>
        <div className="send-rec-selector">
          <div className="send-rec-radio-pair">
            <input
              className="send-rec-radio-input"
              type="radio"
              id="public"
              name="rec-type"
              value="public"
            />
            <label for="public">Public</label>
          </div>

          <div className="send-rec-radio-pair">
            <input
              className="send-rec-radio-pair"
              type="radio"
              id="direct"
              name="rec-type"
              value="direct"
            />
            <label for="direct">Direct</label>
          </div>
        </div>

        <b style={{ display: "block" }}>
          {"Song Popularity: " + props.info.popularity}
        </b>

        <button onClick={()=> {
            createRec();
            }}>Make Recommendation</button>
      </div>
    </div>
  );
};
