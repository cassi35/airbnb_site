import React from 'react'
import './index.css'
function Home() {
  return (
   <>
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