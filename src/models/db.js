const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Final_Year_Project', { useNewUrlParser: true , useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    // db.close();
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

