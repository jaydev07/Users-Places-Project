const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

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
    res.json({ users : users.map(user => user.toObject({getters:true})) });
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
        const error = new HttpError("User Already Exixts.Please Login!",500);
        return next(error);
    }

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        console.log(err);
        const error = new HttpError('Could not create user.Please try again!',500);
        return next(error);
    }

    // Adding the new user
    const newUser = new User({
        name,
        email,
        password:hashedPassword,
        // Storing image path in users database
        image: req.file.path,
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

    let token;
    try{
        // Creating a JWT token 
        token = jwt.sign(
            { userId:newUser.id, email:newUser.email},
            "JdIsAwesome",
            { expiresIn:'1h'}
        );
    }catch(err){
        console.log(err);
        const error = new HttpError('Something wrong!',500);
        return next(error);
    }

    // res.status(200);
    res.json({userId: newUser.id, email:newUser.email , token:token} );

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
        user = await User.findOne( { email:email } );
    }catch(err){
        console.log(err);
        const error = new HttpError('Something wrong!',500);
        return next(error);
    }

    if(!user){
        return next(new HttpError('User not exists.Please Signup!',500));
    }

    let isValidPassword=false;
    try{
        isValidPassword = await bcrypt.compare(password , user.password);
    }catch(err){
        console.log(err);
        const error = new HttpError('Something wrong!',500);
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError('Incorrect Password!',500);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign(
            { userId: user.id, email:user.email},
            "JdIsAwesome",
            { expiresIn:'1h'}
        );
    }catch(err){
        console.log(err);
        const error = new HttpError('Something wrong!',500);
        return next(error);
    }

    res.json({
        userId:user.id,
        email:user.email,
        token:token
    });
}

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;