const dotenv = require('dotenv')
const {connectDB} = require('./src/DB/connectDb')


dotenv.config()


connectDB()