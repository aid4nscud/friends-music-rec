import React from 'react'
import './UserResult.css'

export const UserResult = (props) => {

    return (
        <div className='user-result'>
            <h3 className='username'>{props.info.username}</h3>
            <h3 className='followers'>{'Followers: ' + props.info.followers}</h3>
        </div>
    )
}