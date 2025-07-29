const express = require ('express')
const cors = require('cors')
const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))



// user Routes
const userRouter = require('../src/routes/user.routes')
app.use('/api/v1/users',userRouter)


module.exports = app