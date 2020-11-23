import React from 'react'

export const UserRec = (props) => {

    return (
        <div>
        <p>{"Song: " + props.song}</p>
        <img alt={props.song}src={props.images[2]['url']} />
        <p>{" By: " + props.artist}</p>
        </div>
    )

}