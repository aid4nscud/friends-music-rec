import React, { useState, useEffect } from "react";
import { getCookie } from "../../utils/auth";
import { getInfo } from "../../utils/Spotify";
import axios from "axios";
import { SearchResult } from "../SearchResult/SearchResult";
import "./SearchRec.css";

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
    let setdate = new Date(date)
    setdate = setdate.toString().substring(0,10)
    alert(setdate);

    const rec = {
      song: queued.song,
      artist: queued.artist,
      user: recommender,
      images: queued.images,
      uri: queued.uri,
      date: setdate
    };
    fetch("/create_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec),
    });

    cleanup();
    console.log("rec succesfully added");
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
        <h1>Search a song, and recommend!</h1>
      </div>

      <div className="search-rec-form">
        <input
          className="search-rec-input"
          placeholder="Search Song"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        ></input>

        <button
          className="search-rec-button"
          onClick={() => {
            setSearched(true);
            search(inputValue);
          }}
        >
          Search Song
        </button>
      </div>

      {queued != null && (
        <div>
          <div id="queued-div" className="loading-spinner">
            <iframe
              onLoad={() => {
                document.getElementById("queued-div").style.backgroundImage =
                  "none";
              }}
              style={{ borderRadius: "2rem 0 2rem 2rem" }}
              className="queued-iframe"
              src={queued.url}
              width="400"
              height="300"
              frameBorder="1"
              allowtransparency="false"
              allow="encrypted-media"
            ></iframe>
          </div>
          <b>{"Song Popularity: " + queued.popularity}</b>
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
