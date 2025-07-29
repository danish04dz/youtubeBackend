const dotenv = require('dotenv')
// importinfg databse connection
const {connectDB} = require('./src/DB/connectDb')

// import app.js file
const app = require ('./src/app')

// env config
dotenv.config({
     path: './.env'
})

// databese coneection function call
connectDB()
.then(()=>{
    // server listing
    app.listen(process.env.PORT || 6000,()=>{
        console.log (`server in running on http://localhost:${process.env.PORT}`)

    })
})
// catching error
.catch(err =>{
    console.log("Database connection failed", err)
})


