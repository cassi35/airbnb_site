import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Formik,Form,Field,ErrorMessage} from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
function CreatePost() {
    const navigate = useNavigate() 
    const initialValues = {
        title:"",
        postText:"",
        username:""
    }
    const onsubmit = (data)=>{
        axios.post("http://localhost:3001/posts",data).then((response)=>{
           navigate("/")
          })
    }
    const validationSchema = Yup.object().shape({
        title:Yup.string().required("you must input a title"),
        postText:Yup.string().required(),
        username:Yup.string().min(3).max(15).required()
    })
  return (
 <div className='createPostPage'>

    <Link to={'/'}>homepage</Link>
    <Formik initialValues={initialValues} onSubmit={onsubmit} validationSchema={validationSchema}>
    <Form className="formContainer">
        <label htmlFor="">title: </label>
        <Field id="inputCreatePost" name="title" placeholder="ex john" autoComplete="off" />
        <ErrorMessage name="title" component={"span"} />
        <label htmlFor="">post: </label>
        <ErrorMessage name="postText" component={"span"} />
        <Field id="inputCreatePost" name="postText" placeholder="ex post" autoComplete="off" />
        <label htmlFor="">username: </label>
        <ErrorMessage name="username" component={"span"} />
        <Field id="inputCreatePost" name="username" placeholder="ex john123" autoComplete="off" />
        <button type="submit">create post</button>
    </Form>
</Formik>
 </div>

  )
}

export default CreatePost