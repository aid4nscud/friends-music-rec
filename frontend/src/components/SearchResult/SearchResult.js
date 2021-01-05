import React from "react";
import "./SearchResult.css";

export const SearchResult = (props) => {
  const handleClick = (e) => {
    props.setQueued(props.info);
    props.setResults(null);

    console.log("rec in queue");
  };
  return (
    <div key={props.info.id} onClick={handleClick} className="search-result">
      <div className="header">
        <b>
          {props.info.song.length > 20
            ? props.info.song.substring(0, 21) + "..."
            : props.info.song}
        </b>
      </div>
      <img alt={props.info.song} src={props.info.images[1]["url"]} />
      <b>{props.info.artist}</b>
    </div>
  );
};
