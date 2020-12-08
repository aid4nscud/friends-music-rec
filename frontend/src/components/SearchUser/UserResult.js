import React from 'react'
import './UserResult.css'

export const UserResult = (props) => {

    return (
        <div className='user-result'>
            <p className='username'>{props.info.username}</p>
            <p className='followers'>{'Followers: ' + props.info.followers}</p>
        </div>
    )
}