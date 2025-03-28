import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import axios from 'axios'
import {Route,createBrowserRouter,createRoutesFromElements,Router,RouterProvider, Link} from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import Post from './pages/Post'
function App() {
 
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/' element={<Home/>} />
        <Route path='/createpost' element={<CreatePost/>} />
        <Route path='/post/:id' element={<Post/>} />
      </Route>
    )
  )
  return (
    <>
  <RouterProvider router={router}/>
    </>
  )
}

export default App
