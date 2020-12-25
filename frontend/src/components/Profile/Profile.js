import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/auth";
import { UserRec } from "../UserRec/UserRec";
import "./Profile.css";
import { MdSettings } from "react-icons/md";



export const Profile = (props) => {
  const [userRecs, setUserRecs] = useState(null);
  const [user, setUser] = useState(getCookie("user"));
  const [render, setRender] = useState(0);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

  useEffect(() => {
    
    const url = "/api/get_user_profile";
    const data = { user: user, requestingUser: user };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((parsedJSON) => {
        
        if (parsedJSON["recs"].length > 0) {
          
          setUserRecs(parsedJSON["recs"]);
          setFollowers(parsedJSON["num_followers"]);
          setFollowing(parsedJSON["num_following"]);
        } else if (
          parsedJSON["num_followers"] &&
          parsedJSON["recs"].length <= 0
        ) {
          setFollowers(parsedJSON["num_followers"]);
          setFollowing(parsedJSON["num_following"]);
        }
        if(parsedJSON['recs'].length === 0){
          setUserRecs(null)
          setFollowers(parsedJSON["num_followers"]);
          setFollowing(parsedJSON["num_following"]);
        }
      });
  }, [render]);


  useEffect(()=> {
    window.scrollTo(0, 0);
  })

  const deleteRec = (uri) => {
    const recommender = getCookie("user");

    const rec = {
      uri: uri,
      user: recommender,
    };
    fetch("/api/delete_rec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec),
    })
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed.message) {
          setRender(render + 1);
          console.log(parsed.message);
        } else {
          alert("error");
        }
      });
  };

  

  return (
    <div className="profile">
      {user && (
        <div className="profile-header">
          <h1 style={{color:'black', fontSize:'2rem'}}>
            Welcome to your profile, <span className="span-user">{user}</span>
          </h1>

          <MdSettings className='settings-icon' style={{display:'inline-block', margin:'1rem', position:'relative', top:'2rem'}} size='3em' color='black'/>
          
          <ul className="user-social-info">
            <li style={{ borderRightStyle: "solid", borderColor: "white" }}>
              {followers === null ? "Followers: 0" : "Followers: " + followers}
            </li>
            <li style={{ borderRightStyle: "solid", borderColor: "white" }}>
              {following === null ? "Following: 0" : "Following: " + following}
            </li>
            <li>
              {userRecs === null ? "Recs: 0" : "Recs: " + userRecs.length}
            </li>
          </ul>
        </div>
      )}

      

      {userRecs !== null && userRecs.length > 0 ? (
        
        <div className='profile-recs-container'>
          <div style={{width:'65%',margin:'auto' ,display:'block', position:'relative', left:'2rem' }} className='your-song-recommendations'>
          <h2 style={{color:'black', float:'left',}}>Your Song Recommendations</h2>
          </div>
          
           <div className="profile-recs">
          
          {userRecs.map((rec) => {
            return (
              <UserRec
                date={rec.date}
                render={render}
                setRender={setRender}
                deleteRec={deleteRec}
                likes={rec.likes}
                uri={rec.uri}
                song={rec.song}
                artist={rec.artist}
                images={rec.images}
              />
            );
          })}
        </div>
        </div>
        
      ) : (
        <div className='profile-recs-container'>
        <div  style={{textAlign:'center'}} className="profile-recs">
          <h3 style={{width:'auto', margin:'auto', position:'absolute', top:'50%', left:'40%' }}>
            <span style={{fontSize:'large'}}className='span-user'>{user}</span>hasn't recommended any songs yet :(
          </h3>
        </div>
        
        </div>)
  
}
</div>
)

}
