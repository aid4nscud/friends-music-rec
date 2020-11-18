import React from "react";
import "./SearchResult.css";

export const SearchResult = (props) => {
  const handleClick = (e) => {
    props.setQueued(props.info);

    console.log("rec in queue");
  };
  return (
    <div onClick={handleClick} className="search-result">
      <div className="wrapper">
        <p>{"Song: " + props.info.song}</p>
        <img src={props.info.images[1]['url']} />
        <p>{" By: " + props.info.artist}</p>
      </div>
      <b>{'Popularity: ' + props.info.popularity}</b>
    </div>
  );
};
