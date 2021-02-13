const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    
    emp_id : {
        type : String,
        required : true
    },
    emp_name : {
        type : String,
        required : true,
        min : 6,
        max: 255
    },
    geo_fence_id : {
        type : String,
        required : true,
    },
    entry : {
        type : Number,
        enum : [0, 1],
        default : 0
    },
    entry_date_time : {
        type : Date,
        
        default : null
    },
    exit : {
        type : Number,
        enum : [0, 1],
        default : null
    },
    exit_date_time : {
        type : Date,
        
        default : null
    }
    
},{ collection: "mark-attendance" }
);

module.exports = mongoose.model('Attendence', userSchema);