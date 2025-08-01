const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temp');
    },
    filename : function (req,file,cb){
        cb(null,file.originalname);
    }
})

exports.upload = multer({
    storage,
})