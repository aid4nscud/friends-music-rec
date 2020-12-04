import React from "react";
import "./SearchResult.css";

export const SearchResult = (props) => {
  const handleClick = (e) => {
    props.setQueued(props.info);

    console.log("rec in queue");
  };
  return (
    <div key={props.info.id}onClick={handleClick} className="search-result">
      <div className="header">
        <p>{"Song: " + props.info.song}</p>
        <p>{" By: " + props.info.artist}</p>
        
      </div>
      <img alt={props.info.song}src={props.info.images[1]['url']} />
      <b>{'Popularity: ' + props.info.popularity}</b>
    </div>
  );
};
