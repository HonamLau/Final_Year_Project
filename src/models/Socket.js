const mongoose = require('mongoose');

var socketSchema = new mongoose.Schema({ 
    socketID : {
        type: Number
    }, 
   
    minCurrent : {
        type: Number
    },
    maxCurrent : {
        type: Number
    },
    userName:{
        type:String
    }
});
var Socket = module.exports = mongoose.model('Socket', socketSchema, 'Socket'); 
