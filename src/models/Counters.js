const mongoose = require('mongoose');

var counterSchema = new mongoose.Schema({ 
    _id: {
        type: String,
        required : true
    },
    sequence_value: {
        type: Number,
        default : 0
    }
});
var Counters = module.exports = mongoose.model('Counters', counterSchema, 'Counters'); 