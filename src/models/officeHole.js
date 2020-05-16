const mongoose = require('mongoose');

var holeSchema = new mongoose.Schema({ 
    holeID : {
        type: String
    },
    holeContentID:{
        type: String
    },
    userName:{
        type: String
    }
});

var officeHole = module.exports = mongoose.model('officeHole', holeSchema, 'officeHole'); 