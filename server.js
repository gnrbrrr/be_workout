require('dotenv').config()

const express = require('express')
const compression = require('compression')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workout')
const userRoutes = require('./routes/user')

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


//express app
const app = express()

//middleware
app.use(express.json())
app.use(cors(corsOptions))

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(compression());

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, ()=> {
            console.log(`connected to DB & listening on port`, process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })