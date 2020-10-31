import React, { useEffect, useState } from "react";
import axios from "axios";
import { Recommendations } from "./Recommendations.js";
import "./App.css";
import { MakeRec } from "./MakeRec.js";
import { getInfo } from "./Spotify.js";

const info = getInfo();
const clientID = info.client_id;
const clientSecret = info.client_secret;

function App(props) {
  const [recs, setRecs] = useState(null);
  const [token, setToken] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch("/get_recs")
      .then((res) => res.json())
      .then((parsedJSON) => {
        if(parsedJSON['recs'].length > 0){ 
        console.log(parsedJSON)
        setRecs(parsedJSON["recs"]);
        console.log(recs);}
        else {
          console.log('nothing yet')
        }
       
      });
  }, [results]);



  const search = (query, limit=8) => {

    let url = "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit="+limit;
    console.log(url);

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

      axios(url, {
        headers: {
          Authorization: "Bearer " + tokenResponse.data.access_token,
        },
        method: "GET",
      }).then((searchResponse) => {
        let results = searchResponse.data['tracks']['items']
        let arr = []
        results.forEach(item => arr.push(item))
        console.log(arr)
        setResults(arr);
      });
    
      
    });
  }
    

  return (
    <div className="App">
      <MakeRec token = {token} search = {search} setResults ={setResults} results={results}></MakeRec>

    {recs != null && <Recommendations recs={recs}></Recommendations>}
    </div>
  );
}

export default App;
