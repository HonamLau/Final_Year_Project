const mongoose = require('mongoose');

var dailySchema = new mongoose.Schema({ 
    socketID : {
        type: String
    }, 
   day:{
        type:Number
   },
   month:{
        type:Number
   },
   year:{
        type:Number

   },
   totalUse : {
        type: Number,
        require: true
    }
});
var dailyUsage = module.exports = mongoose.model('dailyUsage', dailySchema, 'dailyUsage'); 
