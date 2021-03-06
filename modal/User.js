const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    
    name : {
        type : String,
        required : true,
        min : 6,
        max: 255
    },
    email : {
        type : String,
        required : true,
        min : 6,
        max : 255
    },
    password : {
        type: String,
        required: true,
        min : 6,
        max: 2048
    },
    create_date : {
        type: Date,
        default : Date.now
    },
    role : {
        type : Number,
        default : 3
    }
},{ collection: "user" }
);

module.exports = mongoose.model('User', userSchema);