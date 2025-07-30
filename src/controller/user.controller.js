const User = require ('../models/user.models')
const {uploadOnCloudinary} = require('../utils/cloudinery.js')

// generate access and refresh token
const generateAccessAndRefreshTokens = async (userId)=>{
    try {
       const user = await User.findById(userId)

       const accessToken = user.generateAccessToken ()
       const refreshToken = user.generateRefreshToken ()

       user.refreshToken =refreshToken
       await user.save({
        validateBeforeSave : false
       })
       return  {accessToken, refreshToken}

        
    } catch (error) {
        console.log("error while generating access token",error);
        
    }
}

// user Register controller
exports.registerUser = async (req,res) => {
    try {
        //user register logic

        // get use detail from from frontend
        // validation lagan hai - koi field empty to nhi
        // check user already exist hai ya nhi
        // check profile image for avatar
        // upload them to cloudinary
        // check avatar successfully upload hua ya nhi cloud pe
        // create user object - crete entry in db
        // remove password and refresh token field from response
        // check for user creation
        // return response

        const {fullName,email,username,password} = req.body
        // console.log("email :" , email)

        if(!fullName || !email || !username || !password){
            return res.status(400).json({message: "All fields are Required"})
        }
        
       const existingUser= await User.findOne({
            $or: [{ username },{ email }]
        })

        if(existingUser){
            return res.status(409).json({message: " username or email already exist"})
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;
        
       // const coverImageLocalPath = req.files?.coverImage[0]?.path;

        let coverImageLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
            coverImageLocalPath = req.files.coverImage[0].path
        }

        if(!avatarLocalPath){
            
            return res.status(400).json({message: " avatar is required"})
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
      


        if(!avatarLocalPath){
            
        
            return res.status(400).json({message: " avatar is required"})
        }


        const user  = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage : coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })
        

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        if(!createdUser){
            return res.status(400).json({message: " something went wrong during creating user!"})
        }

        return res.status(201).json(
            {message: "User created successfully",
            user: createdUser}
        )


 

        
    } catch (error) {
        console.log(error);
        
    }
    
}


// User Login Controller
exports.loginUser = async (req,res) =>{
    try {
        // user se email ya username aur password  body se
    // find user hai ya nhi
    // password check
    //access and refresh token agar password correct hai to
    // send cookies 
    // send success response

   const {email,username,password} = req.body
   if(!(username || email)){
    return res.status(400).json({message:"Username or email required"})
   }

   const user = await User.findOne({
    $or : [{username},{email}]
   })

   if(!user){
    return res.status(400).json({message: " user does not exist"})
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    return res.status(400).json({message: " Invalid user credentials"})
   }

   const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

   const  loggedinUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
    httpOnly : true,
    secure: true
   }
   return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({user : loggedinUser,accessToken,refreshToken})
        
    } catch (error) {
        console.log("error in login controller", error)
    }
   
}

// User Logout Controller
exports.logoutUser = async (req,res) =>{
    try {
       await User.findByIdAndUpdate(req.user._id,{
            $set : {
                refreshToken: undefined
            }
        })

        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({message: "User logged out successfully"})
        
    } catch (error) {
        console.log("error in logout controller", error)
        return res.status(500).json({message: "Internal server error"})
    }
}



