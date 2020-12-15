const uuid = require('uuid');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');

const User = require('../models/user-model');

/*
const DUMMY_USERS = [{
    id:'u1',
    name:"Jaydev Bhavsar",
    email:"test@test.com",
    password:"test"
}];
*/

const getUsers = async (req,res,next) => {

    let users;
    try{
        // Finding all the users but not SHOWING THEIR PASSWORDS
        users = await User.find({},'-password');
    }catch(err){
        console.log(err);
        const error = new HttpError('Something wrong!',500);
        return next(error);
    }
    res.json(users.map(user => user.toObject({getters:true})));
}   

const signUp = async (req,res,next) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return next(new HttpError('Invalid input.Please check'));
    }

    const {name,email,password} = req.body;

    // USING  DUMMY ARRAY
    /* const findUser = DUMMY_USERS.find((user) => {
        return user.email === email;
    });

    if(findUser){
        return next(new HttpError('User already exists'),500);
    }

    const newUser = {
        id:uuid.v4(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(newUser);
    */

    let exestingUser;
    try{
        // Checking wheather the user already exists
        exestingUser = await User.findOne({ email: email });
    }catch(err){
        console.log(err);
        const error = new HttpError('Something wrong!',500);
        return next(error);
    }
    
    // Condition for exestingUser
    if(exestingUser){
        const error = new HttpError("User Already Exixts.Please Login!",422);
        return next(error);
    }

    // Adding the new user
    const newUser = new User({
        name,
        email,
        password,
        image:"https://picsum.photos/200/300",

        // Initially places array will be EMPTY
        // When we add a place & in Place MODEL when we mention USER-ID then this place array will be UPDATED
        places:[]
    });

    try{
        await newUser.save();
    }catch(err){
        console.log(err);
        const error = new HttpError('Something wrong!',500);
        return next(error);
    }

    res.status(201);
    res.json(newUser.toObject({getters:true}));

}

const logIn = async (req,res,next) => {
    const {email,password} = req.body;

    // Using DUMMY ARRAY
    /* const userFound = DUMMY_USERS.find((user) => {
        return user.email === email
    });

    if(userFound){
        if(userFound.password === password){
            res.status(200);
            res.json({message:"Logged in Successfully"});
        }
        else{
            next(new HttpError('Wrong Password',500));
        }
    }
    else{
        next(new HttpError('User not found. Please Signup!'));
    } */

    let user;
    try{
        user = await User.findOne({email:email});
    }catch(err){
        console.log(err);
        const error = new HttpError('Something wrong!',500);
        return next(error);
    }

    if(user){
        if(user.password === password){
            res.json({message:"Login Successfull!"});
        } 
        else{
            res.json({message:"Incorrect Password"});
        }
    }
    else{
        res.json({message:"User not found.Please Signup"});
    }
}

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;