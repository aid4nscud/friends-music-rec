import React, { useEffect, useState } from "react";
import {Recommendations} from './Recommendations.js'
import './App.css'

function App() {
  const [songValue, setSongValue] = useState('');
  const [artistValue, setArtistValue] = useState("");
  const [userValue, setUserValue] = useState("");
  const [recs, setRecs] = useState(null)
  const [isClicked, setIsClicked] = useState(false);
  
  

 useEffect(() => {
    fetch('/aidan').then(res => console.log(res.data))

    fetch('/get_recs').then(res => res.json()).then(parsedJSON => {
      console.log(parsedJSON['recs']) //not working for some reason, the api is returning a Flask Response Object not the json I want.
      setRecs(parsedJSON['recs'])
      console.log(recs)
      

    });
  },[])

  const createRec = (e) => {
    
    if(songValue,artistValue,userValue !== ''){
    const rec = {
      song: songValue,
      artist: artistValue,
      user: userValue
    }
    fetch("/create_rec", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rec)
    })
  }
  else {
    console.log('inputs are invalid');
  }
 
  
  };


  return (
    <div className="App">
      {!isClicked && <button onClick={()=> {
        setIsClicked(true)
      }}> Recommend a good song</button>}
      { isClicked && <form onSubmit={createRec}>
        <input
          placeholder="song"
          value={songValue}
          onChange={(e) => {
           
            setSongValue(e.target.value);
          }}
        ></input>
        <input placeholder="artist" value={artistValue} onChange={e=>{
           
          setArtistValue(e.target.value);
        }}></input>
        <input placeholder="user" value={userValue} onChange={e=>{
         
          setUserValue(e.target.value);
        }}></input>
        {songValue,artistValue,userValue != '' && <button type='submit'>Make Recommendation</button>}
      </form>}
    {<Recommendations  recs = {recs}></Recommendations>}
    </div>
  );
}

export default App;
