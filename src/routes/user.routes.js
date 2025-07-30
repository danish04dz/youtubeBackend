const express = require ('express')
const { registerUser, loginUser, logoutUser } = require('../controller/user.controller')
const { upload } = require('../middleware/multer.middleware')
const { verifyJWT } = require('../middleware/auth.middleware')
const router = express.Router()


// for user register 
router.post('/register',upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),registerUser)

// for user login
router.post('/login',loginUser)

//secure route
router.post('/logout',verifyJWT,logoutUser)




module.exports = router