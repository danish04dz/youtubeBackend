const User = require ('../models/user.models')
const {uploadOnCloudinary} = require('../utils/cloudinery.js')
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