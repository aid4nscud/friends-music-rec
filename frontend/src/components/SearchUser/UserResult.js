import React, { useDebugValue, useEffect, useState } from 'react'
import './UserResult.css'

export const UserResult = (props) => {
    const [followButton, setFollowButton] = useState(null)
    const [render, setRender] = useState(0)
    useEffect(()=> {
        if(props.info.isFollowing === true){
            setFollowButton('Following')
        }
        else {
            setFollowButton("Follow")
        }

    },[])
    
    return (
        <div className='user-result'>
            <h3 className='username'>{props.info.username}</h3>

            { props.searcher !== props.info.username && (props.info.isFollowing === false ? <button onClick={()=> {
                props.follow(props.info.username)
                props.setRender(props.render+1)
                setFollowButton('Following')
            }}className='follow-button'>{followButton}</button> : <button className='follow-button'>{followButton}</button>)}
    
            
        </div>
    )
}