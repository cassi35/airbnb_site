import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]) 
    const navigate = useNavigate() // Substitua useHistory por useNavigate

    useEffect(() => {
        axios.get("http://localhost:3001/posts").then((response) => {
            setListOfPosts(response.data)
        })
    }, [])

    return (
        <>
            <Link to={'/createpost'}>create post</Link>
            {listOfPosts.map((value, key) => {
                return (
                    <div className='post' onClick={() => { navigate(`/post/${value.id}`) }} key={key}>
                        <div className='title'>{value.title}</div>
                        <div className='body'>{value.postText}</div>
                        <div className='footer'>{value.username}</div>
                    </div>
                )
            })}
        </>
    )
}

export default Home