const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    amount:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:['food','entertainment','utilities','shopping','other'],
        default:'other',
    },
});

module.exports = mongoose.model("Transaction",transactionSchema);