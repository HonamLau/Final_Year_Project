const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Final_Year_Project',function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });

const db = mongoose.connection;
db.on("error", () => {
    console.log("> error occurred from the database");
});
db.once("open", () => {
    console.log("> successfully opened the database");
});

let Socket = require('./Socket');

const models = module.exports.models = {Socket};


// var sock1 = new Socket({Name: 'test1', Voltage: 2});
// sock1.save(function(err){
//     if (err) {
//         console.log('Error', err);
//     } else {
//         console.log('data inserted');
//     }
// });
