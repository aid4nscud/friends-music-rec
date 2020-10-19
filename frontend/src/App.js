import React, { useEffect, useState } from "react";
import {Recommendations} from './Recommendations.js'
import './App.css'
import { MakeRec } from "./MakeRec.js";

const api_key = '1d0967220509f44910198c1d77d0f67b'

function App() {
 
  const [recs, setRecs] = useState(null)

  
  
 useEffect(() => {

    fetch('/get_recs').then(res => res.json()).then(parsedJSON => {
      console.log(parsedJSON['recs']) //not working for some reason, the api is returning a Flask Response Object not the json I want.
      setRecs(parsedJSON['recs'])
      console.log(recs)
      

    });
  },[])

  return (
    <div className="App">
      
     
    <MakeRec></MakeRec>
      
    <Recommendations  recs = {recs}></Recommendations>
    
    </div>
  );
}

export default App;
