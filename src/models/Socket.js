const mongoose = require('mongoose');

var socketSchema = new mongoose.Schema({ 
    socketID : {
        type: String
    }, 
    minCurrent : {
        type: Number,
        default:0
    },
    maxCurrent : {
        type: Number,
        default:100
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
    },
    powerOn:{
        type: Boolean,
        default:false
    }
});

var Socket = module.exports = mongoose.model('Socket', socketSchema, 'Socket'); 
