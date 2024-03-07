import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify';

const Signup = () => {
    const navigate = useNavigate()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [email, setEmail] = useState('')
   const [image, setImage] = useState(null)
   const [showPassword, setShowPassword] = useState(false)
   const sanitizedUsername = DOMPurify.sanitize(username)
   const sanitizedPassword = DOMPurify.sanitize(password)
   const sanitizedEmail = DOMPurify.sanitize(email)

   const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};

   const signUp = async() => {
      try {
        if(username.length !== 0 && password.length !== 0 && email.length !== 0){
        const response = await axios.post('http://localhost:3000/users/signup', {sanitizedUsername, sanitizedPassword, sanitizedEmail, image})
        toast.success(response.data.message)
        navigate('/login')
        }else{
          toast.error('Please provide credentials')
        }
      } catch (error) {
        console.log(error)
      }
   }

   const handleImage = (e) => {
    const file  =  e.target.files[0]
    setFileToBase(file)
    console.log(file)
   }

   const setFileToBase = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setImage(reader.result)
    }
   }

  return (
    <>
       <div className='flex flex-col w-5/6 h-screen gap-7 justify-center items-center mx-auto '>
       <h1 className='pacifico-regular'>MelodyVerse</h1>

       <div className='flex flex-col p-5 gap-2 items-center md:w-2/5 w-4/5 border border-gray-500 border-solid rounded-lg'>
       <h1 className='text-xl text-white'>Sign-Up</h1>
      <label className='text-white'>Username:</label>
      <input 
      className='p-2 border border-solid border-gray-500 rounded'
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      />
      <label className='text-white'>Email:</label>
      <input 
      className='p-2 border border-solid border-gray-500 rounded'
       value={email}
       onChange={(e) => setEmail(e.target.value)} 
      />
      <label className='text-white'>Password:</label>
      <div className='flex gap-2'>
      <input 
      className='ml-7 p-2 border border-solid border-gray-500 rounded'
      type={showPassword ? 'text' : 'password'}
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={togglePasswordVisibility} style={{color: 'white'}}><i  className="fa-solid fa-eye"></i></button>
      </div>
      <label className='text-white'>Upload Profile Picture:</label>
      <input 
            type='file'
            accept='.jpeg, .png, .jpg'
            placeholder='Choose Image'
            className='bg-white p-2 rounded'
            onChange={handleImage}
            ></input>
      <button className='border border-solid border-gray-500 p-2 rounded bg-blue-500 text-white hover:bg-blue-700' onClick={signUp}>Sign-Up</button>
      <h1 className='text-l text-white'>Already Have an account?. <Link style={{
        marginLeft: '5px',
        textDecoration: 'underline', fontWeight: 'bold'}} to='/login'>Login</Link></h1>
      </div>

    </div>
      
    </>
   
  )
}

export default Signup
