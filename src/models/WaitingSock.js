const mongoose = require('mongoose');

var waitingSchema = new mongoose.Schema({ 
    MAC:{
        type:String
    },
    socketID:{
        type:String
    }
});

var WaitingSock = module.exports = mongoose.model('WaitingSock', waitingSchema, 'WaitingSock'); 
