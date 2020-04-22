const mongoose = require('mongoose');

var socketSchema = new mongoose.Schema({ 
    socketID : {
        type: String
    }, 
    minCurrent : {
        type: Number
    },
    maxCurrent : {
        type: Number
    },
    userName:{
        type:String
    },
    attached:{
        type: Boolean,
        default:false
    },
    MAC:{
        type:String
    }
});

var Socket = module.exports = mongoose.model('Socket', socketSchema, 'Socket'); 
