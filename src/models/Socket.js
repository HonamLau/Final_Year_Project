const mongoose = require('mongoose');

var socketSchema = new mongoose.Schema({ 
    socketID : {
        type: Number
    }, 
    name: {
        type: String
    },
    minVoltage : {
        type: Number
    },
    maxVoltage : {
        type: Number
    }
});
var Socket = module.exports = mongoose.model('Socket', socketSchema, 'Socket'); 
