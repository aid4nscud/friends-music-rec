import React, { useState } from 'react'
import './Recommendations.css'
import {Rec} from './Rec'



 export const Recommendations = (props) => {

    const [index, setIndex] = useState(0)
     
    return (
        <div>
            <h3> Listen to recommenadations!</h3>
            <div>{props.recs && <Rec rec={props.recs[index]}></Rec>}</div>
        <button onClick={()=> {
            let set = Math.floor(Math.random() * props.recs.length);
           setIndex(set);
        }
        }>Next Rec</button>
        <div>{<button onClick={()=> {
setIndex(0);
        }}> Refresh</button>}</div>
        </div>
        
    )
}
