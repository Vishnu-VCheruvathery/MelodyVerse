import { Route, Routes } from 'react-router-dom'
import './App.css'
import {Toaster} from 'react-hot-toast'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Post from './pages/Post'


function App() {
 

  return (
    <>
       <Toaster 
        position={window.innerWidth < 768 ? 'bottom-center' : 'bottom-right'}
         toastOptions={{duration: 5000}}/>
       <Routes>
          <Route path='/' element={<Signup/>}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/posts' element={<Post/>} />
       </Routes>     
    </>
  )
}

export default App
