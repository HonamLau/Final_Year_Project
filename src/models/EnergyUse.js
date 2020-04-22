const mongoose = require('mongoose');

var usageSchema = new mongoose.Schema({ 
    socketID : {
        type: String,
        require : true
    },
    // datetime : {
    //     type: Date,
        
    // },
    // Year:{type: Number},

    // Month:{type: Number},

    // Day:{type: Number},
    YMD:{type: String},
    
    Hour:{type: Number},

    Minute:{type:Number},

    dateTime:{type :Date},

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