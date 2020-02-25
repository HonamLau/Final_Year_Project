const mongoose = require('mongoose');

var permissionSchema = new mongoose.Schema({ 
    ruleID : {
        type: Number
    },
    roleName : {
        type: String
    },
    roleLevel : {
        type: Number
    } ,
    userManagement: {
        type : Boolean,
        default: false
    } ,
    socketManagement :{
        type : Boolean,
        default: false
    },
    workspaceManagement :{
        type : Boolean,
        default: false
    }
});
var UserPermission = module.exports = mongoose.model('UserPermission', permissionSchema, 'UserPermission'); 