import React from 'react'

export const Rec = (props) => {
    return (
        <div>
            <p>{'Song: ' + props.song}</p>
            <img src={props.imageURL}/>
            <p>{' By: ' + props.artist}</p>   
            
        </div>
    )
}