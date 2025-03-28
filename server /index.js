const express = require('express')
const app = express()
const db = require('./models')
///routers
const postRouter = require('./routes/Posts')
app.use("/posts",postRouter)

db.sequelize.sync().then(()=>{
    app.listen(3000,()=>{
        console.log('app rodando na porta 3000')  
      })
})
