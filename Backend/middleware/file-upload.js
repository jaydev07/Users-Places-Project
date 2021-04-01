const multer = require("multer");
const uuid = require("uuid");

// It's the types given by MULTER so we rapup the extensions with it
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

// multer is itself a middle ware
const fileUpload = multer({
    // Limit for data bits
    limit: 500000,

    // Where the files should be stored
    storage: multer.diskStorage({
        destination: (req,file,cb) => {
            // Here we just have to set a path where to store the images
            cb(null , 'uploads/images');
        },
        filename: (req,file,cb) => {
            // Getting the extension
            const extension = MIME_TYPE_MAP[file.mimetype];
            //giving the name to a file with proper extension 
            cb(null , uuid.v4() + '.' + extension);
        }
    }), 

    // We validate the file in backend because we cannot relay on frontend validation
    fileFilter: (req,file,cb) => {
        // !! -> will return either true or false if the extension is present MIME_TYPE_MAP
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        // We will set the error if the file exxtension is invalid
        const error = isValid ? null : new Error('Invalid mime type');
        cb(error,isValid);
    }
});

module.exports = fileUpload;