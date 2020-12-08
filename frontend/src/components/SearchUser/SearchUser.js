import React, { useState } from "react";
import {UserResult} from './UserResult'
import './SearchUser.css'

export const SearchUser = (props) => {
  const [input, setInput] = useState(null);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState(null)

  const search = () => {
    const query = input;

    const url = "/api/search_user";

    const data = { user: query };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.users) {
          setResults(parsed.users);
        } 
        else if(parsed.noresults){
            setMessage('No users found :(')
        }
      });
  };

  return (
    <div className='search-user'>
      <div className='search-user-header'>
        <h1>Find friends to share your music with!</h1>
      </div>
      <div className='search-user-form'>
        <input className='search-user-input'
          placeholder="Search a username"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          onClick={() => {
            search();
          }}
        >
          Search
        </button>
        {results !== null && <button classname='clear-button' onClick={()=> {
          setResults(null);
      }}>Clear</button>}
      </div>
     

      {results && (
        <div className="search-results">
          {results.map((user) => {

            const info = {
              id: user["_id"],
              username: user["username"],
              followers: user['followers']
            };

            return (
              <UserResult
                info={info}
              />
            );
          })}
        </div>
      )}
      {message && <h3>{message}</h3>}

    </div>
  );
};
