const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({ 
    userID : {
        type: Number 
    },
    userName : {
        type: String,
        required: true
    },
    userPassword : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    roleName : {
        type: String
    },
    roleLevel : {
        type: Number
    } ,
    createDate: {
        type : Date,
        default: Date.now
    } ,
    email :{
        type: String,
        required: true
    }    
});
var Users = module.exports = mongoose.model('Users', userSchema, 'Users'); 