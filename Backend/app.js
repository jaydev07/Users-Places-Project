// For deleting file if the error occured in signup route
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

app.use(bodyParser.json());

// Giving the image files to the frontend
app.use('/uploads/images', express.static(path.join('uploads','images')))

// We should add this at last because it is use to patch the BACKEND - FRONTEND 
app.use((req,res,next) => {
    // Header used to patch the backend with Frontend
    // It will allow the access form any browser NOT ONLY localhost:3000
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    next();
})

app.use("/api/users",userRoutes);
app.use("/api/places",placesRoutes);

// This is a middle-ware function which will be called when the route is not found 
app.use((req,res,next) => {
    const error = new HttpError('Could not find the route!',404);
    next(error);
})

app.use((error,req,res,next) => {
    // Removing the file from the folder with given path
    if(req.file){
        fs.unlink(req.file.path , (err) => {
            console.log(err);
        })
    }

    // If the response is already given
    if(res.headerSent){
        return next(error);
    }
    
    res.status(error.code || 500)
    res.json({message:error.message || "An unknown error found!"});
})

mongoose
    .connect('mongodb+srv://admin-jaydev:jd123@cluster0.48tad.mongodb.net/mern?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true  })
    .then(() => {
        app.listen(5000,() => {
            console.log("Server is listening on 5000");
        });
    })
    .catch((err) => {
        console.log(err);
    })
