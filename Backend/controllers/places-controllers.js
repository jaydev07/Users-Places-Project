const fs = require('fs');

const HttpError = require("../models/http-error");
const uuid = require('uuid');
const {validationResult} =require('express-validator');
const mongoose = require('mongoose');

const Place = require('../models/place-model');
const getCoordinatesByAddress = require("../util/location");
const User = require('../models/user-model');
const { Mongoose } = require("mongoose");

/* DUMMY ARRAY    
var DUMMY_PLACES= [{
    id:"p1",
    title:"Empire State building",
    description:"One of the most tallest building",
    location:{
        lat:40.7484474,
        lng:-73.9871516
    },
    address:"20 W 34th St, New York , NY 1001",
    creator:"u1"
}
];
*/

const getElementByUserId = async (req,res,next) => {
    const userId = req.params.uid;

    /* Using DUMMY Array
    const placesFound = DUMMY_PLACES.filter((place) => {
        return place.creator === userId;
    });

    if(placesFound.length === 0){
        return next(new HttpError('Could not find the user!',404));
    }
    */

    let placesFound;
    let user;
    try{
        // Getting place by USERID
        // Using Place Model
        // placesFound = await Place.find( { creator:userId } );

        // Using User Model & POPULATE METHOD
        user = await User.findById(userId).populate('places');
    }catch(err){
        console.log(err);
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    if(user.places.length === 0){
        return next(new HttpError('Could not find the user!',404));
    }

    // Because placesFound is an Array we have to use MAP function  
    res.json({place : user.places.map( place => place.toObject( { getters:true } ) ) } );
}

const getElementByPlaceId = async (req,res,next) => {
    const placeId = req.params.pid;

    /* Using DUMMY ARRAY
    const idetifiedPlace = DUMMY_PLACES.find((place) => {
        return place.id === placeId;
    });

    if(!idetifiedPlace){
        return next(new HttpError('Could not find the place!',404));
    }
    */

    // Finding the place usinf FINDBYID in Mongoose
    let place;
    try{
        place = await Place.findById(placeId);
    }catch(err){
        console.log(err);
        const error = new HttpError("Somthing went worng",500);
        return next(error);
    }

    if(!place){
        return next(new HttpError('Could not find the place!',404));
    }

    // To provide an "id" in the OUTPUT NOT "_id"
    res.json({place:place.toObject( { getters:true } )});
}

const createPlaces = async (req,res,next) => {

    // Validating that the Input is In Correct form or not
    const error = validationResult(req);

    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError('Invalid input.Please Check!',422));
    }

    // DESTRUCTURING input from body
    const { title , description ,  address , creator } = req.body;

    const coordinates = getCoordinatesByAddress(address);

    /* Using DUMMY ARRAY
    const createdPlace = {
        id:uuid.v4(),
        title,
        description,
        location:coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);
    */

    // Making a document to STORE IN MONGODB
    const createdPlace = new Place({
        title,
        description,
        image:req.file.path,
        location:coordinates,
        address,
        creator
    });

    let user;
    try{
        // Finding that the USER mentioned EXIXTS
        user = await User.findById(creator);
    }catch(err){
        console.log(err);
        return next(new HttpError('Could not add place!',500));
    }

    // If USER DOESNOT EXISTS
    if(!user){
        const error = new HttpError('Could not find the User!',404);
        return next(error);
    }

    // SAVING the document or throwing error when it occurs
    try{
        // Creating the Session because we have to UPDATE 2 Collections(USERS,PLACES) which are INDEPENDENT
        const sess = await mongoose.startSession();
        
        // If any error occurs in between the TRANSACTION then it will br THROWN
        sess.startTransaction();
        
        // Saving the PLACE into collection
        await createdPlace.save({session:sess});
        
        // PUSHING the ID of PLACE into USERS COLLECTIONS
        user.places.push(createdPlace);
        await user.save({session:sess});
        
        sess.commitTransaction();
    }catch(err){
        return next(new HttpError('Could not able to save it.Please try again!'),500);
    }

    res.status(201);
    res.json({createdPlace});
};

const updatePlace = async (req,res,next) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return next(new HttpError('Invalid input.Please Check',422));
    }
     
    const {title,description} = req.body;
    const placeId = req.params.pid;

    /* Using DUMMY ARRAY
    const placeFound = { ...DUMMY_PLACES.find((place) => {
        return place.id === placeId;
    })
    }

    const placeIndex = DUMMY_PLACES.findIndex(p => p.id===placeId);

    placeFound.title = title;
    placeFound.description = description;

    DUMMY_PLACES[placeIndex] = placeFound;
    */

    // Finding the Place which is to be updated
    let placeFound;
    try{
        placeFound = await Place.findById(placeId);
    }catch(err){
        const error = new HttpError('Something Wrong!',422);
        return next(error);
    }

    // This is for authorization. and toString() method is used to change the type frrom object to String.
    if(placeFound.creator.toString() !== req.userData.userId){
        const error = new HttpError('You are not allowed to edit the place',401);
        return next(error);
    }

    // UPDATING the Place
    placeFound.title = title;
    placeFound.description = description;

    // SAVING after Updation
    try{
        await placeFound.save();
    }catch(err){
        const error = new HttpError('Something Wrong!',500);
        return next(error);
    }

    res.status(201);
    res.json({place:placeFound.toObject({getters:true})});

}

const deletePlace = async (req,res,next) => {
    const placeId = req.params.pid;

    /* Using DUMMY ARRAY
    if(!DUMMY_PLACES.find(place => place.id === placeId)){
        return next(new HttpError("Cound not find the place with that id"),422);
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId);
    */

    let place;
    try{
        // POPULATE will give a whole USER object having placeID -> we can assess by "place.creator"
        place = await Place.findById(placeId).populate('creator');
    }catch(err){
        console.group(err);
        const error = new HttpError('Someething went Wrong',500);
        return next(error);
    }

    if(!place){
        const error = new HttpError("Place not found",404);
        return next(error);
    }
    if(place.creator.id !== req.userData.userId){
        const error = new HttpError("You are not allowed to delete the place!",404);
        return next(error);
    }

    const imagePath = place.image;

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session:sess});

        // Now we can assess the User(having placeID) by "place.creator"
        place.creator.places.pull(place);
        await place.creator.save({session:sess});
        
        sess.commitTransaction();

    }catch(err){
        console.log(err);
        const error = new HttpError('Is not deleted',500);
        return next(error);
    }

    // For deleting the image from backend
    fs.unlink(imagePath, err => {
        console.log(err);
    });

    res.status(200).json({message:"Deleted Item!"});

}

exports.getElementByPlaceId = getElementByPlaceId;
exports.getElementByUserId = getElementByUserId;
exports.createPlaces = createPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace; 
