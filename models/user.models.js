const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required :true,

    },
    fullname :{
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },

    avtar : {
        type : String,

    },
    refreshToken : {
        type : String
    },
    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }     
    ]


},{timestamps:true})

module.exports = mongoose.model("User", userSchema)