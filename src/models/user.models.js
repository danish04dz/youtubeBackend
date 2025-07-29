const mongoose = require('mongoose')
const jwt = require ('jsonwebtoken')
const bcrypt = require ('bcrypt')


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true // for better searching 
    },
    email : {
        type : String,
        required :true,
        unique : true,
        lowercase : true,
        trim : true,

    },
    fullName :{
        type : String,
        required : true,
        trim : true,
        index : true
    },
    password : {
        type : String,
        required : [true, 'Password is Required']
    },

    avatar : {
        type : String,  // cloudinary url
        required : true,
    },
    coverImage : {
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



// encrypt password 

userSchema.pre("save", async function (next){
    if(!this.isModified("password"))
        return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

// check pasword (user ne sahi pasword likha hia ya nahi)

userSchema.methods.isPaswordCorrect = async function (password) {
   return await  bcrypt.compare(password,this.password)
    
}

// acces token

userSchema.methods.generateAccessToken = function(){

    return  jwt.sign(
        {
            _id :this._id,
            email : this.email,
            username : this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    
}
userSchema.methods.generateRefreshToken = function(){
     return  jwt.sign(
        {
            _id :this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    
}

module.exports = mongoose.model("User", userSchema)