import React from "react";
import "./SearchResult.css";

export const SearchResult = (props) => {
  const handleClick = (e) => {
    props.setQueued(props.info);
    props.setResults(null)

    console.log("rec in queue");
  };
  return (
    <div key={props.info.id}onClick={handleClick} className="search-result">
      <div className="header">
        <b>{"Song: " + props.info.song}</b>
        <b>{" By: " + props.info.artist}</b>
        
      </div>
      <img alt={props.info.song}src={props.info.images[1]['url']} />
      <b>{'Popularity: ' + props.info.popularity}</b>
    </div>
  );
};
