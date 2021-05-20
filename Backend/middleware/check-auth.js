const jwt = require("jsonwebtoken");

const HttpError = require('../models/http-error');

module.exports = (req,res,next) => {
    try{
        // Authorization : "Baerer token"
        token = req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error("Authentication failed!");
        }

        // This gives us a payload  
        const decodedToken = jwt.verify(token , "JdIsAwesome");
        req.userData = { userId:decodedToken.userId };
        next();
    }catch(err){
        console.log(err);
        const error = new HttpError('Authentication failed!',401);
        return next(error);
    }
    
}