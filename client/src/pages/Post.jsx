import React, { useState } from 'react'
import {useParams} from 'react-router-dom'
import { useEffect } from 'react'
import axios  from 'axios'
function Post() {
  let {id } = useParams()
  const [postObj,setPosObj] = useState({})
  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byid/${id}`).then((response) => {
     setPosObj(response.data)
    })
}, [])
  return (
   <>
   <div className='postPage'>
    <div className='leftSide'>
      <div className='title'>{postObj.title}</div>
      <div className='post'>{postObj.postText}</div>
      <div className='footer'>{postObj.username}</div>
    </div>
    <div className='rightSide'></div>
   </div>
   </>

  )
}

export default Post