import React from 'react'
import axios from 'axios'
import {useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
function Home() {
    const [listOfPosts,setLisOfPosts] = useState([])
    useEffect(()=>{
      axios.get("http://localhost:3001/posts").then((response)=>{
        setLisOfPosts(response.data)
      })
    },[])
  return (
   <>
    <Link to={'/createpost'} >create post</Link>
     {listOfPosts.map((value,key)=>{
      return <div className='post'>
        <div className='title' >{value.title}</div>
        <div className='body' >{value.postText}</div>
        <div className='footer' >{value.username}</div>
      </div>
    })}
   </>
  )
}

export default Home