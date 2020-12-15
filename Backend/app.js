const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

app.use(bodyParser.json());

app.use("/api/users",userRoutes);
app.use("/api/places",placesRoutes);

// This is a middle-ware function which will be called when the route is not found 
app.use((req,res,next) => {
    const error = new HttpError('Could not find the route!',404);
    next(error);
})

app.use((error,req,res,next) => {

    // If the response is already given
    if(res.headerSent){
        return next(error);
    }
    
    res.status(error.code || 500)
    res.json({message:error.message || "An unknown error found!"});
})

mongoose
    .connect('mongodb+srv://admin-jaydev:jd123@cluster0.48tad.mongodb.net/palces?retryWrites=true&w=majority',)
    .then(() => {
        app.listen(3000,() => {
            console.log("Server is listening on 3000");
        });
    })
    .catch((err) => {
        console.log(err);
    })
