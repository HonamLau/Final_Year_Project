const mongoose = require('mongoose');

var usageSchema = new mongoose.Schema({ 
    socketID : {
        type: Number,
        require : true
    },
    datetime : {
        type: Date,
        default: Date.now
    },
    current : {
        type: Number
    },
    switchOn : {
        type: Boolean,
        default: false
    },
    switchOff : {
        type: Boolean,
        default: false
    }
});
var EnergyUse = module.exports = mongoose.model('EnergyUse', usageSchema, 'EnergyUse'); 