import { useState } from "react";

import React from "react";
import { SearchResult } from "./SearchResult";

export const MakeRec = (props) => {
  const [imageURL, setImageURL] = useState(null);
  const [message, setMessage] = useState(null);
  const [songValue, setSongValue] = useState("");
  const [artistValue, setArtistValue] = useState("");
  const [userValue, setUserValue] = useState("");

  const createRec = (searchChoice) => {
    
      const rec = {
        song: searchChoice.song,
        artist: searchChoice.artist,
        user: searchChoice.user,
        imageURL: searchChoice.imageURL,
      };
      fetch("/create_rec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rec),
      });

      props.setResults([])
   
  }
  

  return (
    <div>
      <h3>Search for a song to recommend :)</h3>

      <form onSubmit={createRec}>
        <input
          placeholder="song"
          value={songValue}
          onChange={(e) => {
            setSongValue(e.target.value);
          }}
        ></input>

        <input
          placeholder="artist"
          value={artistValue}
          onChange={(e) => {
            setArtistValue(e.target.value);
          }}
        ></input>

        {imageURL && (
          <input
            placeholder="user"
            value={userValue}
            onChange={(e) => {
              setUserValue(e.target.value);
            }}
          ></input>
        )}
      </form>

      <button
        onClick={() => {
          props.search(songValue + " " + artistValue);
        }}
      >
        Search Song
      </button>

      {props.results && (
        <div>
          {props.results.map((item) => {
            return <SearchResult create={createRec} id={item['id']} imageURL={item["album"]['images'][1]['url']} song={item['name']} artist={item["album"]["artists"]['0']['name']} />
            
          })}
        </div>
      )}

      <img src={imageURL} />
      {imageURL && songValue != null && (
        <h2>{songValue + " by: " + artistValue}</h2>
      )}
    </div>
  );
};
