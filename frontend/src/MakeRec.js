import { useState } from "react";
import React from "react";

export const MakeRec = () => {
  const [imageURL, setImageURL] = useState(null);
  const [message, setMessage] = useState(null);
  const [songValue, setSongValue] = useState("");
  const [artistValue, setArtistValue] = useState("");
  const [userValue, setUserValue] = useState("");

  const [artist, setArtist] = useState('');
  const [song, setSong] = useState(null)

  const api_key = "1d0967220509f44910198c1d77d0f67b";

  const searchRec = () => {
    const url =
      "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" +
      api_key +
      "&artist=" +
      artistValue +
      "&track=" +
      songValue +
      "&format=json";

    fetch(url)
      .then((response) => response.json())
      .then((res) => {
       console.log(res)
        const albumPicURL = res["track"]["album"]["image"][2]["#text"];
        setArtist(res["track"]["artist"]["name"]);
        setSong(res['track']['name'])
        

        if (albumPicURL != null) {
          setImageURL(albumPicURL);
        }
      });

      
    
    // if (artist != '') {
    //   const url2 =
    //     "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
    //     artist +
    //     "&api_key=" +
    //     api_key +
    //     "&format=json";

    //   fetch(url2)
    //     .then((response) => response.json())
    //     .then((res) => {
         
    //       console.log(res);
    //     });
    // }
  };

  const createRec = (e) => {
    if ((songValue, artistValue, userValue !== "")) {
      const rec = {
        song: songValue,
        artist: artistValue,
        user: userValue,
        imageURL: imageURL,
      };
      fetch("/create_rec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rec),
      });
    } else {
      console.log("inputs are invalid");
    }
  };

  return (
    <div>
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

        {
          (songValue,
          artistValue,
          userValue != "" && imageURL != null && (
            <button type="submit">Make Recommendation</button>
          ))
        }
      </form>

      <button
        onClick={() => {
          if ((songValue, artistValue != "")) {
            searchRec();
          }
        }}
      >
        Search Song
      </button>

      <h3>{message}</h3>

      <img src={imageURL} />
      {imageURL && song != null && <h2>{song + ' by: ' + artist}</h2>}
    </div>
  );
};
