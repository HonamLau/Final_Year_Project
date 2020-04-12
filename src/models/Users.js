const mongoose = require('mongoose');
const Counters = require('./Counters');

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
userSchema.pre('save',function(next) {
    var doc = this;
    Counters.findByIdAndUpdate({_id: 'userID'}, {$inc: { sequence_value: 1} }, {new: true, upsert: true}).
        then(function(count) {
        console.log("...count: "+JSON.stringify(count));
        doc.userID = count.sequence_value;
        next();
    })
    .catch(function(error) {
        console.error("counter error-> : "+error);
        throw error;
    });
});
var Users = module.exports = mongoose.model('Users', userSchema, 'Users'); 