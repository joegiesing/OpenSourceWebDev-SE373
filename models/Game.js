const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
    {
        title: {type:String, required:true, trim:true},
        platform: {type:String, required:true, trim:true},
        genre: {type:String, required:true, trim:true},
        rating: {type:Number, min:0, max:10, required:true},
        releaseYear: {type:Number, min:1970, max:2100, required:true},
        owner: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:false}
    },
    {timestamps:true}
);

module.exports = mongoose.model("Game", GameSchema);
