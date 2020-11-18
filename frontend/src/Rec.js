import React, { useEffect, useRef, useState } from "react";
import { getInfo } from "./Spotify.js";
import axios from 'axios'
const obj = getInfo();
const clientSecret = obj.client_secret
const clientID = obj.client_id

export const Rec = (props) => {
  const [previewURL, setPreviewURL] = useState(null)
  let uri = props.uri;
  let uriCode = uri.substr(14);

  let url = "https://open.spotify.com/embed/track/" + uriCode;
  useEffect(() => {
    if (props.token == null) {
      let url = 'https://api.spotify.com/v1/tracks/'+ uriCode

      console.log(url);

      //getting token for client-credentials flow authorization from Spotify
      axios("https://accounts.spotify.com/api/token", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(clientID + ":" + clientSecret),
        },
        data: "grant_type=client_credentials",
        method: "POST",
      }).then((tokenResponse) => {
        console.log(tokenResponse);
        props.setToken(tokenResponse.data.access_token);
        //using that token response to request the track information
        axios(url, {
          headers: {
            Authorization: "Bearer " + tokenResponse.data.access_token,
          },
          method: "GET",
        }).then((trackResult) => {
          
          //created track objects from the json response and added them to an array
          let prevURL = trackResult.data['preview_url']
          setPreviewURL(prevURL);
          console.log(trackResult.data)
        });
      });
    }
    else {
     let url = 'https://api.spotify.com/v1/tracks/'+ uriCode

     axios(url, {
      headers: {
        Authorization: "Bearer " + props.token,
      },
      method: "GET",
    }).then((trackResult) => {
      
      //created track objects from the json response and added them to an array
      let prevURL = trackResult['preview_url']
      setPreviewURL(prevURL);
    });

    }
  },[]);

  // pause audio sound

  return (
    <div>
      <iframe
        src={url}
        width="380"
        height="400"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>

      <button onClick={props.nextRec}>Next</button>
    </div>
  );
};
