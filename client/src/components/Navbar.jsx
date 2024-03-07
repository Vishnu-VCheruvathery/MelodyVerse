import React, {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [profile, setProfile] = useState(null)

  const logout = () => {
    console.log(cookies.token); // Check if the token exists before removal
    removeCookie('token'); // Try removing the token
    console.log(cookies.token); // Check if the token still exists after removal
    navigate('/')
};



useEffect(() => {
  if (cookies.token) {
    const decodedToken = jwtDecode(cookies.token);
    setProfile(decodedToken.profile.url); // Update userId using setUserId
 
  }
}, [cookies.token]);

  return (
    <div className='bg-gold flex justify-between items-center p-2 px-3'>
      <h1 style={{color: 'black'}} className='pacifico-regular'>MelodyVerse</h1>
      <div className='flex items-center gap-2'>
       <img src={profile} style={{width: '50px', borderRadius: '50%', height: '50px'}}/>
      <button onClick={logout}><i style={{fontSize: '2em'}} class="fa-solid fa-right-from-bracket"></i></button>
      </div>
      
    </div>
  )
}

export default Navbar
