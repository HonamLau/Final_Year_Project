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
        type: Number
    },
    scheduleOn : {
        type: Number
    },
    scheduleOff : {
        type: Number
    },
    minCurrent: {
        type: Number
    }
});
var PowerPlan = module.exports = mongoose.model('PowerPlan', planSchema, 'PowerPlan'); 