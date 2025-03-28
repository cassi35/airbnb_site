import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import axios from 'axios'
import { useEffect } from 'react'
function App() {
  const [listOfPosts,setLisOfPosts] = useState([])
  useEffect(()=>{
    axios.get("http://localhost:3001/posts").then((response)=>{
      setLisOfPosts(response.data)
    })
  },[])
  return (
    <>
  
    </>
  )
}

export default App
