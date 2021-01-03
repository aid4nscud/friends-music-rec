import React, { useRef, useState } from "react";
import { UserResult } from "./UserResult";
import "./SearchUser.css";
import { getCookie } from "../../utils/auth";
import { FaSearchengin } from "react-icons/fa";

export const SearchUser = (props) => {
  const [input, setInput] = useState(null);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState(null);
  const [render, setRender] = useState(0);
  const [searcher, setSearcher] = useState(null);

  const search = () => {
    setResults(null);
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
          setMessage(null);
          setResults(parsed.users);
        } else if (parsed.noresults) {
          setMessage("No users found :(");
          setResults(null);
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
          setRender(render + 1);
        }
      });
  };

  const unfollow = (userToUnfollow) => {
    const userUnfollowing = getCookie("user");

    const data = {
      userToUnfollow: userToUnfollow,
      userUnfollowing: userUnfollowing,
    };
    fetch("/api/unfollow_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.success) {
          setRender(render + 1);
        } else {
          alert("error");
        }
      });
  };

  return (
    <div className="search-user">
      <h1 style={{ color: "black" }}>Search Profiles</h1>
      <div className="search-user-form">
        <input
          className="search-user-input"
          placeholder="Search a username"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyPress={(e) => {
            let code;

            if (e.key !== undefined) {
              code = e.key;
            } else if (e.keyIdentifier !== undefined) {
              code = e.keyIdentifier;
            } else if (e.keyCode !== undefined) {
              code = e.keyCode;
            }

            if (code === "Enter") {
              search();
            }
          }}
        />
        <div
          className="search-user-button"
          onClick={() => {
            search();
          }}
        >
          <FaSearchengin
            color="black"
            size="3em"
            className="search-user-icon"
          />
        </div>
        {results !== null && (
          <div
            className="search-user-clear-button"
            onClick={() => {
              setResults(null);
            }}
          >
            Clear
          </div>
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
                render={render}
                setRender={setRender}
                searcher={searcher}
                info={info}
                follow={follow}
                unfollow={unfollow}
              />
            );
          })}
        </div>
      )}
      {message && <h3>{message}</h3>}
    </div>
  );
};
