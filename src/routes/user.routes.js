const express = require ('express')
const { registerUser } = require('../controller/user.controller')
const { upload } = require('../middleware/multer.middleware')
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




module.exports = router