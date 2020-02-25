const mongoose = require('mongoose');

var usageSchema = new mongoose.Schema({ 
    datetime : {
        type: Date,
        default: Date.now
    },
    current : {
        type: Number
    },
    on : {
        type: Boolean,
        default: false
    },
    off : {
        type: Boolean,
        default: false
    }
});
var EnergyUse = module.exports = mongoose.model('EnergyUse', usageSchema, 'EnergyUse'); 