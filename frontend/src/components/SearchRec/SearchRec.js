import React, { useState, useEffect } from "react";

import { getInfo } from "../../utils/Spotify";
import axios from "axios";
import { SearchResult } from "../SearchResult/SearchResult";
import "./SearchRec.css";
import { FaSearchengin } from "react-icons/fa";
import { QueuedRec } from "../QueuedRec/QueuedRec";

export const SearchRec = (props) => {
  const info = getInfo();
  const clientID = info.client_id;
  const clientSecret = info.client_secret;

  const [inputValue, setInputValue] = useState("");
  const [queued, setQueued] = useState(null);
  const [results, setResults] = useState(null);

  const cleanup = () => {
    setInputValue("");
    setQueued(null);
    setResults(null);
    props.setPopup(null)
  };

  const search = (query, limit = 8) => {
    setQueued(null);
    let url =
      "https://api.spotify.com/v1/search?q=" +
      query +
      "&type=track&market=US&limit=" +
      limit;

    //getting token for client-credentials flow authorization from Spotify
    axios("https://accounts.spotify.com/api/token", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientID + ":" + clientSecret),
      },
      data: "grant_type=client_credentials",
      method: "POST",
    }).then((tokenResponse) => {
      props.setSpotifyToken(tokenResponse.data.access_token);
      //using that token response to request the track information
      axios(url, {
        headers: {
          Authorization: "Bearer " + tokenResponse.data.access_token,
        },
        method: "GET",
      }).then((searchResponse) => {
        if (searchResponse.data) {
          let results = searchResponse.data["tracks"]["items"];
          let arr = [];
          results.forEach((item) => arr.push(item));

          //created track objects from the json response and added them to an array
          const set = removeDuplicates(arr);

          setResults(set);
        } else {
          alert("error chango");
        }
      });
    });
  };

  return (
    <div className="make-rec">
      <div className="search-header">
        <h1 style={{ display: "inline-block", verticalAlign: "middle" }}>
          Search a song, and make a recommendation!
        </h1>
        {props.popup !== null && (
          <button
            style={{
              display: "inline-block",
              marginLeft: "1rem",
              verticalAlign: "middle",
            }}
            onClick={() => {
              props.setPopup(null);
            }}
          >
            EXIT
          </button>
        )}
      </div>

      <div className="search-rec-form">
        <input
          onKeyPress={(e) => {
            let code;

            if (e.key !== undefined) {
              code = e.key;
            } else if (e.keyIdentifier !== undefined) {
              code = e.keyIdentifier;
            } else if (e.keyCode !== undefined) {
              code = e.keyCode;
            }

            if (code === "Enter") {
              search(inputValue);
            }
          }}
          className="search-rec-input"
          placeholder="Search Song"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        ></input>

        <div
          className="search-rec-button"
          onClick={() => {
            search(inputValue);
          }}
        >
          <FaSearchengin className="search-icon" color="black" size="3em" />
        </div>
      </div>

      {queued !== null && <QueuedRec cleanup={cleanup} info={queued} />}

      {results !== null && queued === null && (
        <div className="search-results">
          {results.map((item) => {
            let uri = item.uri;
            let uriCode = uri.substr(14);

            let url = "https://open.spotify.com/embed/track/" + uriCode;

            const info = {
              url: url,
              id: item["id"],
              images: item["album"]["images"],
              song: item["name"],
              artist: item["album"]["artists"]["0"]["name"],
              popularity: item["popularity"],
              uri: item["uri"],
            };

            return (
              <SearchResult
                setResults={setResults}
                setQueued={setQueued}
                info={info}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const removeDuplicates = (recs) => {
  let unique = [];

  recs.forEach((rec) => {
    let bool = true;
    unique.forEach((r) => {
      if (
        r["album"]["artists"]["0"]["name"] ===
        rec["album"]["artists"]["0"]["name"]
      ) {
        bool = false;
      }
    });

    if (bool === true) {
      unique.push(rec);
    }
  });

  return unique;
};
