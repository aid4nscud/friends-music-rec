import React, { useState, useEffect } from "react";
import { getCookie } from "../../utils/auth";
import { getInfo } from "../../utils/Spotify";
import axios from "axios";
import { SearchResult } from "../SearchResult/SearchResult";
import "./SearchRec.css";
import { FaSearchengin } from "react-icons/fa";

export const SearchRec = (props) => {
  const info = getInfo();
  const clientID = info.client_id;
  const clientSecret = info.client_secret;

  const [inputValue, setInputValue] = useState("");
  const [queued, setQueued] = useState(null);
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const cleanup = () => {
    setInputValue("");
    setQueued(null);
    setResults([]);
    setSearched(false);
  };

  const createRec = () => {
    const recommender = getCookie("user");
    let date = Date.now();
    let setdate = new Date(date);
    setdate = setdate.toString().substring(0, 10);

    const rec = {
      song: queued.song,
      artist: queued.artist,
      user: recommender,
      images: queued.images,
      uri: queued.uri,
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
          cleanup();
          console.log("rec succesfully added");
        }
      });
  };

  const search = (query, limit = 8) => {
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
          setSearched(false);
        } else {
          alert("error chango");
        }
      });
    });
  };

  return (
    <div className="make-rec">
      <div className="search-header">
        <h1>Search a song, and make a recommendation!</h1>
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
          

          if (code === 'Enter') {
            setSearched(true);
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
            setSearched(true);
            search(inputValue);
          }}
          
        >
          <FaSearchengin className="search-icon" color="white" size="3em" />
        </div>
      </div>

      {queued != null && (
        <div>
          <div
            style={{
              textAlign: "left",
              background: "#111111",
              width: "30%",
              margin: "auto",
              borderRadius: "2rem 0 2rem 2rem",
            }}
            id="queued-div"
            className="loading-spinner"
          >
            <b style={{ margin: "0.5rem" }}>
              {"Song Popularity: " + queued.popularity}
            </b>

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
              src={queued.url}
              width="99%"
              height="300"
              frameBorder="1"
              allowtransparency="false"
              allow="encrypted-media"
            ></iframe>
          </div>

          <button onClick={createRec}>Make Recommendation</button>
        </div>
      )}
      {results === null && searched === true && (
        <div className={"loading-spinner"}></div>
      )}
      {results && (
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
                create={createRec}
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
