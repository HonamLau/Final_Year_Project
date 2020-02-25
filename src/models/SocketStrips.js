const mongoose = require('mongoose');

var stripSchema = new mongoose.Schema({ 
    stripID : {
        type: Number
    }, 
    name: {
        type: String
    },
    socket1ID : {
        type: Number
    }, 
    socket2ID : {
        type: Number
    }, 
    socket3ID : {
        type: Number
    }, 
    socket4ID : {
        type: Number
    }
});
var SocketStrips = module.exports = mongoose.model('SocketStrips', stripSchema, 'SocketStrips'); 
