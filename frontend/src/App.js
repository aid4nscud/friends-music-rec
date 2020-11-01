import React, { useEffect, useState } from "react";
import axios from "axios";
import { Recommendations } from "./Recommendations.js";
import "./App.css";
import { MakeRec } from "./MakeRec.js";
import { getInfo } from "./Spotify.js";

const info = getInfo();
const clientID = info.client_id;
const clientSecret = info.client_secret;

const removeDuplicates = (recs) => {
  let unique = [];

  recs.forEach(rec => {
   
      let bool= true;
      unique.forEach(r => {
        if(r["album"]["artists"]["0"]["name"] == rec["album"]["artists"]["0"]["name"]){
          bool = false;
        }
      })

      if(bool == true){
        unique.push(rec)
      }
      
    }
  )
  console.log(unique)

return unique

}

function App(props) {
  const [recs, setRecs] = useState(null);
  const [token, setToken] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch("/get_recs")
      .then((res) => res.json())
      .then((parsedJSON) => {
        if (parsedJSON["recs"].length > 0) {
          setRecs(parsedJSON["recs"]);
          console.log(recs);
        } else {
          console.log("nothing yet");
        }
      });
  }, [results]);

  const search = (query, limit = 8) => {
    let url =
      "https://api.spotify.com/v1/search?q=" +
      query +
      "&type=track&market=US&limit=" +
      limit;
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
      setToken(tokenResponse.data.access_token);
  //using that token response to request the track information
      axios(url, {
        headers: {
          Authorization: "Bearer " + tokenResponse.data.access_token,
        },
        method: "GET",
      }).then((searchResponse) => {
        let results = searchResponse.data["tracks"]["items"];
        let arr = [];
        results.forEach((item) => arr.push(item));
        console.log(arr);
  //created track objects from the json response and added them to an array
        const set = removeDuplicates(arr);
        console.log(set)
        setResults(set)
        alert(JSON.stringify(results[0]['album']['images']))
      });
    });
  };

  return (
    <div className="App" >
      <MakeRec
        token={token}
        search={search}
        setResults={setResults}
        results={results}
      ></MakeRec>

      {recs != null && <Recommendations recs={recs}></Recommendations>}
    </div>
  );
}

export default App;
