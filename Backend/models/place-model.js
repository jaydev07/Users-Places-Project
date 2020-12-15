const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    title:{ type:String , required:true },
    description: {type:String , required:true },
    image:{type:String , required:true},
    location:{
        lat:{type:Number , required:true},
        lng:{ type:Number , required:true }
    },
    address: { type:String , required:true },

    // It will be a objectID & REFRENCE of USER MODEL
    creator:{type: mongoose.Types.ObjectId , required:true , ref:'User'}
});

module.exports=mongoose.model('Place',placeSchema);