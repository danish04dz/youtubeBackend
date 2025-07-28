const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema ({

    videoFile : {
        type :String,
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    duration : {
        type : Number
    },
    views : {
        type : Number
    },
    isPublished : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },


},{timestamps:true})

module.exports = mongoose.model("Video",videoSchema)