const mongoose = require('mongoose');

var socketSchema = new mongoose.Schema({  
    Name: String,
    Voltage : Number,
});
var Socket = module.exports = mongoose.model('Socket', socketSchema, 'Socket'); 
