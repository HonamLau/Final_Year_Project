const http = require("http");
const express = require('express');
const app = express();
const path = require('path');
const db = require('./models/db');


app.use('/static', express.static('public'));
app.get('/',function(request, response){
    response.sendFile(path.join(__dirname,'../','public','index.html'))
}
);

app.listen(5000,function(){
    console.log('Sever Listening')
})

const models = db.models;
var Socket =  models.Socket;

var sock1 = new Socket({Name: 'test1', Voltage: 2});
sock1.save(function(err){
    if (err) {
        console.log('Error', err);
    } else {
        console.log('data inserted');
    }
});

