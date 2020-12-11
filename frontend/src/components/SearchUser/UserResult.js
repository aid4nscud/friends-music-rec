import React, { useDebugValue, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthRoute } from '../AuthRoute'
import { SearchedProfile } from '../SearchedProfile/SearchedProfile'
import './UserResult.css'

export const UserResult = (props) => {
    const [followButton, setFollowButton] = useState(null)
    const history = useHistory();
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
            
            <h3  onClick={() => {
                  const url = "/app/profile/" + props.info.username;
                 
                  history.push(url);
                }} className='username'>{props.info.username}</h3>
            
            

            { props.searcher !== props.info.username && (props.info.isFollowing === false ? <button onClick={()=> {
                props.follow(props.info.username)
                props.setRender(props.render+1)
                setFollowButton('Following')
            }}className='follow-button'>{followButton}</button> : <button className='follow-button'>{followButton}</button>)}

      
    
            
        </div>
    )
}