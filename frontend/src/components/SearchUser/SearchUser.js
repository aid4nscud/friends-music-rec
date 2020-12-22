import React, { useState } from "react";
import { UserResult } from "./UserResult";
import "./SearchUser.css";
import { getCookie } from "../../utils/auth";

export const SearchUser = (props) => {
  const [input, setInput] = useState(null);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState(null);
  const [render, setRender] = useState(0)
  const [searcher, setSearcher] = useState(null);

  const search = () => {
    const query = input;

    const url = "/api/search_user";
    const currSearcher = getCookie("user");
    if (currSearcher !== null) {
      setSearcher(currSearcher);
    }

    const data = { user: query, searcher: currSearcher };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.users) {
          setResults(parsed.users);
        } else if (parsed.noresults) {
          setMessage("No users found :(");
        }
      });
  };

  const follow = (userToFollow) => {
    const userFollowing = getCookie("user");

    const data = {
      userToFollow: userToFollow,
      userFollowing: userFollowing,
    };
    fetch("/api/follow_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.success) {
          setRender(render+1)

        }
      });
  };

  return (
    <div className="search-user">
      <h1 style={{color:'black'}}>Search Profiles</h1>
      <div className="search-user-form">
        <input
          className="search-user-input"
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
        {results !== null && (
          <button
            classname="clear-button"
            onClick={() => {
              setResults(null);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {results && (
        <div className="user-search-results">
          {results.map((user) => {
            const info = {
              id: user["_id"],
              username: user["username"],
              followers: user["followers"],
              isFollowing: user["isFollowing"],
            };
            

            return (
              <UserResult
              render = {props.render}
              setRender = {props.setRender}
                searcher={searcher}
                info={info}
                follow={follow}
                
              />
            );
          })}
        </div>
      )}
      {message && <h3>{message}</h3>}
    </div>
  );
};
