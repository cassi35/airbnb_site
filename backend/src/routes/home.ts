import z from 'zod'
import {defineRoutes} from '../utils/utils'

export default defineRoutes(app =>{
  app.get('/',(req,res)=>{
    res.send('Welcome to the home page!')
  })
})