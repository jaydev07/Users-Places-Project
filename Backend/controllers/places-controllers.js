const HttpError = require("../models/http-error");
const uuid = require('uuid');
const {validationResult} =require('express-validator');

const Place = require('../models/place-model');
const getCoordinatesByAddress = require("../util/location");

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
    try{
        // Getting place by USERID
        placesFound = await Place.find( { creator:userId } );
    }catch(err){
        console.log(err);
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    if(placesFound.length === 0){
        return next(new HttpError('Could not find the user!',404));
    }

    // Because placesFound is an Array we have to use MAP function  
    res.json({palce: placesFound.map( place => place.toObject( { getters:true } ) ) } );
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
    res.json({palce:place.toObject( { getters:true } )});
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
        image:"https://picsum.photos/200/300",
        location:coordinates,
        address,
        creator
    });

    // SAVING the document or thriwung error when it occurs
    try{
        await createdPlace.save();
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

    /* Using DUMMY ARRAY
    const {title,description} = req.body;
    const placeId = req.params.pid;

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
        place = await Place.findById(placeId);
    }catch(err){
        console.group(err);
        const error = new HttpError('Someething went Wrong',500);
        return next(error);
    }

    try{
        await place.remove();
    }catch(err){
        console.log(err);
        const error = new HttpError('Someething went Wrong',500);
        return next(error);
    }

    res.status(200).json({message:"Deleted Item!"});

}

exports.getElementByPlaceId = getElementByPlaceId;
exports.getElementByUserId = getElementByUserId;
exports.createPlaces = createPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;