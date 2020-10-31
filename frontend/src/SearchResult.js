import React from 'react'
import './SearchResult.css'

export const SearchResult = (props) => {
const handleClick = (e) => {
    let obj = {
        song: props.song,
        artist: props.artist,
        user: null,
        imageURL: props.imageURL
    }
    props.create(obj)
    console.log('rec created')
    
}
    return (
        <div onClick={handleClick} className='search-result'>
            <p>{'Song: ' + props.song}</p>
            <img src={props.imageURL}/>
            <p>{' By: ' + props.artist}</p>   
            
        </div>
    )
}