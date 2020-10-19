import React from 'react'

export const Rec = (props) => {
    return (
        <div>
            <p>{'Song: ' + props.rec.song}</p>
            <p>{'Artist: ' + props.rec.artist}</p>
            <p>{'User: ' + props.rec.user}</p>
            <img src={props.rec.imageURL}/>
            
        </div>
    )
}