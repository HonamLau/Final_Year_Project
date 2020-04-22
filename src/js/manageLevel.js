// const http = require("http");
// const session = require("express-session");
// const express = require('express');
// const app = express();
// const expressWs = require('express-ws')(app);
// const path = require('path');
// const db = require('./models/db');
// const Sockett=require('./models/Socket');
// const Usersss = require('./models/Users');
// const bodyParser = require('body-parser');
// const url = require('url');
// const mongoose = require('mongoose');

// const router = express.Router();
// const dotenv = require('dotenv');
// const verify = require('./routes/verifyToken');
// const cookieParser = require('cookie-parser');
// const loginRedirect = require('./routes/loginRedirect');
// const daily=require('./models/dailyUsage');

var db = connect('143.89.130.87:5000/Final_Year_Project/Users');

var allUser = null; 

allUser = db.userName.find();   

$(document).ready(function(){
    // console.log("ready!");
    // const usersList= Usersss.find({},{
    //     userName:1
    // });
    // console.log(usersList.length);
    // var data=[];
    // for(var i=0;i<usersList.length;++i){
    // var ha = usersList[i].userName;
    // data.push([ha]);
    // console.log(ha);
    // }
    
    var x = document.getElementById("userBeingChanged");
    
    
    for(var i=0;i<10;++i){
        var option = document.createElement("option");
        option.value = option.text = "jesus";
    }
    
    x.add(option);

    console.log("end");
});