const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
    category:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    month:{
        type:String,
        required:true,
    },
}, {timestamps: true});

module.exports = mongoose.model("Budget",budgetSchema);
