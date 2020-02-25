const mongoose = require('mongoose');

var workspaceSchema = new mongoose.Schema({ 
    workspaceID : {
        type: Number
    },
    name : {
        type: String
    },
    strip1ID : {
        type: Number
    }, 
    strip2ID : {
        type: Number
    }, 
    strip3ID : {
        type: Number
    }, 
    strip4ID : {
        type: Number
    }
});
var Workspaces = module.exports = mongoose.model('Workspaces', workspaceSchema, 'Workspaces'); 