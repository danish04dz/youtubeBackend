const mongoose = require('mongoose');

const {DB_Name } = require('../constants')

exports.connectDB = async () => {
    try {
        
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(" DataBAse Connected Successfully")
        
    } catch (error) {
        console.error("error while connecting with DB")
    }
}

