const mongoose = require('mongoose');

var workspaceplanSchema = new mongoose.Schema({ 
    planID : {
        type: Number
    },
    workspaceID: {
        type: Number
    },
    name: {
        type: String
    }
});
var WorkspacePlan = module.exports = mongoose.model('WorkspacePlan', workspaceplanSchema, 'WorkspacePlan'); 