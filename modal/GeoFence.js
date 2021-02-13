const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    location_name : {
        type : String,
        required : true,
        min : 2
    },
    longtitude : {
        type : Number,
        required : true
    },
    latitude : {
        type : Number,
        required : true
    },
    radius : {
        type : Number,
        required : true
    },
    create_date : {
        type : Date,
        default : Date.now
    }
    
},{ collection: "geo-fence" }
);

module.exports = mongoose.model('GeoFence', userSchema);