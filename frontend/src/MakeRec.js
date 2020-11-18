import { useState } from "react";

import React from "react";
import { SearchResult } from "./SearchResult";

export const MakeRec = (props) => {
  const [images, setImages] = useState(null);
  const [songValue, setSongValue] = useState("");
  const [artistValue, setArtistValue] = useState("");
  const [userValue, setUserValue] = useState("");
  const [queued, setQueued] = useState(null);

  const cleanup = () => {
    setSongValue("");
    setArtistValue("");
    setUserValue("");
    setQueued(null);
    props.setResults([]);
  };

  const createRec = () => {
    alert(queued.uri);
    const rec = {
      song: queued.song,
      artist: queued.artist,
      user: queued.user,
      images: queued.images,
      uri: queued.uri,
    };
    fetch("/create_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec),
    });

    cleanup();
    console.log("rec succesfully added");
  };

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

        {images && (
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

      {queued != null && (
        <div>
          <p>{queued.song}</p>
          <img src={queued.images[1]["url"]} />
          <p>{queued.artist}</p>
          <p>{"Popularity: " + queued.popularity}</p>
          <button onClick={createRec}>Make Recommendation</button>
        </div>
      )}

      {props.results && (
        <div>
          {props.results.map((item) => {
            const info = {
              id: item["id"],
              images: item["album"]["images"],
              song: item["name"],
              user: null,
              artist: item["album"]["artists"]["0"]["name"],
              popularity: item["popularity"],
              uri: item["uri"],
            };
            
            return (
  
              <SearchResult
                setResults={props.setResults}
                setQueued={setQueued}
                create={createRec}
                info={info}
              />
            );
          })}
        </div>
      )}

      {images && <img src={images[1]["url"]} />}
      {images && songValue != null && (
        <h2>{songValue + " by: " + artistValue}</h2>
      )}
    </div>
  );
};
