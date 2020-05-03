const mongoose = require('mongoose');

var planSchema = new mongoose.Schema({ 
    planID : {
        type: Number
    },
    mainPlanID: {
        type: Number
    },
    workspaceID: {
        type: Number
    },
    socketID: {
        type: String
    },
    Hour : {
        type: Number
    },
    Minute : {
        type: Number
    },
    timeOfNow:{
        type: Date
    },
    minCurrent: {
        type: Number
    }
});
var PowerPlan = module.exports = mongoose.model('PowerPlan', planSchema, 'PowerPlan'); 