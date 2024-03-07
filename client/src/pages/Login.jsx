import axios from 'axios'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify';

const Login = () => {
   const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const navigate = useNavigate()
    const [confirmPassword, setConfirmPassword] = useState('')
    const [password, setPassword] = useState('')
    const [resetPassword, setResetPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [inputsDisabled, setInputsDisabled] = useState(false); 
    const [showPassword, setShowPassword] = useState(false)
    const [showFPassword, setShowFPassword] = useState(false)
    const [showDiv, setShowDiv] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

  const toggleFPasswordVisibility = () => {
    setShowFPassword(!showFPassword);
};

   const toggleDivVisibility = () => {
      setShowDiv(!showDiv)
   }

    const Login = async () => {
      try {
        if (confirmPassword.length !== 0 && password.length !== 0 && email.length !== 0) {
          // Check if the user has exceeded the maximum login attempts
          if (loginAttempts >= 3) {
            toast.error('Maximum login attempts exceeded. Please try again later.');
            setInputsDisabled(true);
            return;
          }
    
          if (password === confirmPassword) {
            const sanitizedPassword = DOMPurify.sanitize(password);
            const sanitizedEmail = DOMPurify.sanitize(email);
    
            const response = await axios.post('http://localhost:3000/users/login', {
              password: sanitizedPassword,
              email: sanitizedEmail,
            });
    
            if (response.data.error) {
              toast.error(response.data.error);
              // Increment login attempts counter
              setLoginAttempts(loginAttempts + 1);
            } else {
              setCookie('token', response.data.token);
              console.log(response.data);
              toast.success('Login Successful!');
              navigate('/posts');
            }
          } else {
            toast.error("Passwords don't match");
            // Increment login attempts counter
            setLoginAttempts(loginAttempts + 1);
          }
        } else {
          toast.error('Please provide credentials');
        }
      } catch (error) {
        console.log(error);
        // Increment login attempts counter
        setLoginAttempts(loginAttempts + 1);
      }
    };

    const Reset = async() => {
       try {
         if(resetPassword.length !== 0 && email.length !== 0){

          const response = await axios.post(`http://localhost:3000/users/reset`, {email, resetPassword})
          if(response.data.error){
            toast.error(response.data.error)
          }else{
            toast.success(response.data.message)
          }
         }else{
           toast.error('Please provide credentials')
         }
       } catch (error) {
        console.log(error)
       }
    }
  return (
  

    <div className='flex flex-col w-5/6 h-screen gap-2 justify-center items-center mx-auto'>
        <h1 className='pacifico-regular'>MelodyVerse</h1>
        <div className='flex flex-col p-5 gap-2 items-center  md:w-2/5 w-3/5 border border-gray-500 border-solid rounded'>
        <h1 className='text-xl text-white'>Login</h1>

      <label className='text-white'>Email:</label>
      <input 
      className='p-2 border border-solid border-gray-500 rounded mr-6'
        value={email}
        required
        disabled={inputsDisabled}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className='text-white'>Password:</label>
      <div className='flex gap-2'>
      <input 
      className='p-2 border border-solid border-gray-500 rounded'
      type={showPassword ? 'text' : 'password'}
        value={password}
        required
        disabled={inputsDisabled}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={togglePasswordVisibility} style={{color: 'white'}}><i  className="fa-solid fa-eye"></i></button>
      </div>
   
      <label className='text-white'>Confirm Password:</label>
      <div className='flex gap-2'>
      <input 
      className='p-2 border border-solid border-gray-500 rounded'
      type={showFPassword ? 'text' : 'password'}
        value={confirmPassword}
        required
        disabled={inputsDisabled}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={toggleFPasswordVisibility} style={{color: 'white'}}><i  className="fa-solid fa-eye"></i></button>
      </div>
    
      <button 
      className='border border-solid border-gray-500 p-2 rounded bg-blue-500 text-white hover:bg-blue-700'
      disabled={inputsDisabled}
      onClick={Login}>Login</button>
      <label onClick={toggleDivVisibility} className='text-l text-white'>Forgot your password?</label>
       <div className={`${showDiv ? 'flex' : 'hidden'} gap-2 mt-3`}>
       <input 
       value={resetPassword}
       onChange={(e) => setResetPassword(e.target.value)}
       className='p-2 border border-solid border-gray-500 rounded'/>
       <button 
       onClick={Reset}
       className='text-white'>OK</button>
       </div>
      
      </div>
       </div>
  )
}

export default Login
