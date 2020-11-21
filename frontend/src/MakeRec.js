import { useState } from "react";

import React from "react";
import { SearchResult } from "./SearchResult";

export const MakeRec = (props) => {
  const [images, setImages] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [userValue, setUserValue] = useState("");
  const [queued, setQueued] = useState(null);

  const cleanup = () => {
    setInputValue("");
    setUserValue("");
    setQueued(null);
    props.setResults([]);
  };

  const createRec = () => {

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
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
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
          props.search(inputValue);
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
      {images && inputValue != null && (
        <h2>{inputValue + " by: " }</h2>
      )}
    </div>
  );
};
