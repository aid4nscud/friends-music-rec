import React, { useEffect, useState } from "react";
import auth from '../../utils/auth'
import {UserRec} from '../UserRec/UserRec'

export const Profile = () => {
    const [userRecs, setUserRecs] = useState(null)

    useEffect(()=> {
//GETS THE RECOMMENDATIONS MADE BY THE USER AND SETS THE STATE 
    },[])

    const user = auth.getUser()

    return (<div>
        <h1>{'Welcome to your profile '+ user}</h1>

        {userRecs!==null && userRecs.map(rec=> {
           return <UserRec
            song={rec.song}
            artist={rec.artist}
            image={rec.image}
            
            />
        })}


    </div>)
}


