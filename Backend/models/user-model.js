const mongoose = require('mongoose');

// Used to give an inedex to the email-id so that it can be retrived faster 
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name:{ type:String , required:true },
    email:{ type:String , required:true , unique:true },
    password: {type:String , required:true , minlength:5 },
    image:{type:String , required:true},
    // It will be an ARRAY of Places with REFRENCE to PLACE MODEL
    places:[{type: mongoose.Types.ObjectId , required: true , ref:'Place'}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);

