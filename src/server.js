const http = require("http");
const session = require("express-session");
const express = require('express');
const app = express();
// const expressWs = require('express-ws')(app);
const path = require('path');
const db = require('./models/db');
const Socket = require('./models/Socket');
const Users = require('./models/Users');
const url = require('url');
const mongoose = require('mongoose');
const EnUse = require('./models/EnergyUse');

const router = express.Router();
const dotenv = require('dotenv');
const verify = require('./routes/verifyToken');
const cookieParser = require('cookie-parser');
const loginRedirect = require('./routes/loginRedirect');
const daily=require('./models/dailyUsage');

const verifyAdmin = require('./routes/verifyAdmin');
const models = db.models;
// var Socket =  models.Socket; 
// var EnergyUse =  models.EnergyUse; 
const PowerPlan = require('./models/PowerPlan');
// var users = models.Users;
const WaitingSock = require('./models/WaitingSock');

// Get Router
const authRouter = require('./routes/auth');
const powerRouter = require('./routes/powerUse');
const adminRouter = require('./routes/adminSetting');
const officeRouter = require('./routes/office');
const planRouter = require('./routes/powerPlan');
const schedule = require('node-schedule');

// var timeout = require('connect-timeout');
// app.use(timeout('5000'));


dotenv.config({path:'./src/.env'});

router.get('/',loginRedirect, async function(req, res){
    // res.sendFile(path.join(__dirname,'../','public','index.html'))
    // res.redirect('./home');

    // var attachedSockID = req.cookies.attachedSockID;
    res.clearCookie('attachedSockID');
    var attachedSock = await Socket.findOne({userName: req.cookies.user, 
        attached:true});
    var plan;
    if (attachedSock) {
      console.log(
        req.cookies.user + " has attached socket: " + attachedSock.socketID
      );
      res.cookie('attachedSockID', attachedSock.socketID);

      plan = await PowerPlan.findOne({socketID: attachedSock.socketID});
      if (plan){

      }
      console.log(plan);
    }
    
    var found = 0;
    var mySocket = await Socket.find({userName: req.cookies.user});
    // console.log(mySocket);
    if (mySocket){
        for (const socket of mySocket) {
            // console.log(socket.socketID);
        }
    }
    console.log("user level of "+req.cookies.user+" is "+req.cookies.userLevel)
    console.log("attached to"+attachedSock);
    res.render('home',{name : req.cookies.user,
        lv: req.cookies.userLevel, mySocket: mySocket,
        haveSocket:found, attachedSock:attachedSock,
        powerPlan:plan});

});

router.post('/attach',verify, async function(req, res){
    // if(req.cookies.attachedSockID){
        var attachedSock = await Socket.findOneAndUpdate(
            {userName: req.cookies.user, 
            socketID : req.cookies.attachedSockID,
            attached : true},
            { $set: { "attached" : false}}
            );
        res.clearCookie('attachedSockID');
    // }
    var socketID = req.body.atSock;
    var newSock = await Socket.findOneAndUpdate(
        {userName: req.cookies.user, 
        socketID : socketID},
        { $set: { "attached" : true}},
        function(err){
            if (err)
            console.log("notfound");
        });
        if (newSock){
            console.log(req.cookies.user+" attach socket: "+socketID);
            res.cookie('attachedSockID', newSock.socketID);
        }
    // res.cookie('attachedSockID', socketID);
    res.redirect('/');
});


router.post('/removeSocket',verify, async function(req, res){
    var attachedSock = await Socket.findOneAndUpdate(
        {userName: req.cookies.user, 
        socketID : req.cookies.attachedSockID,
        attached : true},
        { $set: { attached : false}}
        );
        if(attachedSock){
            console.log(attachedSock);
            console.log(req.cookies.user+" remove attached socket: "+req.cookies.attachedSockID);
        }
    res.clearCookie('attachedSockID');
    res.redirect('/');
});

//save the data sent from Arduino
// app.get('/read', async function(req, res){
//     //var line = req.params.id;
//     //console.log(line);
//     console.log("arduino");
//     // res.send("OFF\n");
//     var test = await Socket.findOne({socketID : "socket1"});
//     // console.log(test);
//     if (test){
//         console.log("send");
//         if (test.powerOn == true){
//             res.send("ON\n");
//         }
//         else{
//             res.send("OFF\n");
//         }
//     }
//     return;

    // // res.send("OFF\n");
    // var q=url.parse(req.url,true).query; //req.url = the full link to the website
    // var current=q.current;
    // // var id = q.id.toString();
    // var id = "socket1";
    // var result = await Socket.find({socketID: id},{powerOn: 1, _id: 0});
//     var OnOff=true;
    
//     if(result.powerOn==false){
//     current = 0;
//     OnOff = false}
//     var inTable = Socket.find({socketID: id}).countDocuments();
//     if(inTable<1){
//         res.send("OFF");
//         return;
//     }
//     else{
//         var inTable2 = Socket.find({socketID: id});
//         //undefined-> never been assigned a user.
//         //""/null->has been assigned user but now removed.
//         if(inTable2[0].userName==undefined||inTable2[0].userName==""||inTable2[0].userName==null){
//             res.send("OFF");
//             return;
//         }
        
//     }
//     var d = new Date();
//     var ymd = d.getFullYear().toString()+"/"+(d.getMonth()+1).toString()+"/"+d.getDate().toString();
//     await EnUse.insertMany([{"YMD":ymd,"Hour":d.getHours(),"Minute": d.getMinutes(),"dateTIme": d,
//                              "socketID":id, "current":current, "switchOn": OnOff

// }]);


    // console.log(result);
    // console.log("the socket is right now: " + result[0].powerOn);
    // if (result[0].powerOn == false) {
    //     res.send("OFF\n");
    //     console.log("send off");
    // } else {
    //     res.send("ON\n");
    //     console.log("send on");
    // }

    
// });


// app.get('/',function(request, response){
//     response.sendFile(path.join(__dirname,'../','public','index.html'))
// });


// ------Middleware--------
app.use(express.json()); //enable to get json fomat info from request parameter of POST method
app.use(express.urlencoded({extended:false})); //enable to get the form filled in info from "request" parameter of POST method
app.use(session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: 'ssh!quiet,it\'asecret!',
    
    cookie:{
        maxAge: 1000*60*60,
        sameSite: true,
        secure: false
    }
}));
app.use(cookieParser());


// --------Middleware---------


// ----------WebSocket-------
// app.ws('/echo', function(ws, req) {
//     ws.on('message', function(msg) {
//         ws.send(msg);
//     });
// });

// app.ws('/', function(ws, req) {
//     ws.on('message', function(msg) {
//         console.log(msg);
//     });
//     console.log('socket', req.testing);
// });
// --------WebSocket------------

// Set Router
app.use('/',router);
app.use('/auth', authRouter);
app.use('/powerUse', powerRouter);
app.use('/adminSetting', adminRouter);
app.use('/office', officeRouter);
app.use('/powerPlan', planRouter);

// Set views
app.set('views',path.join(__dirname,'../','src','views'));
app.set('view engine', 'ejs',);
app.use('/styles',express.static(__dirname +'/styles'));

app.use('/js',express.static(__dirname +'/js'));

const server = app.listen(5000, async function(){
    console.log("start listening at port 5000");
    try{
        await WaitingSock.remove();
        console.log("clear waitlist");
    }
    catch(e){
        console.log("waitlist error ", e);
    }
});

// server.timeout = 10000;

var io = require('socket.io')(server);
require('./io.js')(io);

router.get('/testio',async function(req, res){
    // io.emit("testing", "testing");
    res.render("io");
});

var socketClient = require('socket.io-client')('http://143.89.130.87:5000/IOT');

// <----------Server match arduino----------
app.get('/matching', async function(req, res){
    console.log("matching");
    var q=url.parse(req.url,true).query;
    console.log("matching query: ", q);
    var MAC = q.mac.toString();
    console.log("matching Mac: ", MAC);
    var waitingSock;
    var socket = await Socket.findOne({
        MAC:MAC
    });
    if(socket){
        res.send("matched");
    }else{
        console.log("find in waitlist");
        waitingSock = await WaitingSock.findOne({
            MAC:MAC
        });

        if (waitingSock){
            console.log("waitlist found");
        }else{
            console.log("emit to waitlist");
            socketClient.emit("socketToServer",MAC);
        }
    }
    

});
// ----------Server match arduino---------->

router.get('/read', async function (req,res){
    console.log("arduino is here")
var q=url.parse(req.url,true).query; //req.url = the full link to the website
//var id = q.id.toString();
var mac = q.mac.toString();
var temp = await Socket.find({MAC: mac});
// var temp =  await Socket.find({socketID: id});
//console.log(temp[0].powerOn);
if(temp!=undefined&&temp!=null&&temp[0].powerOn==true&&temp[0].userName!=null&&temp[0].userName!=undefined&&temp[0].userName!=""){
    var id = temp[0].socketID;
    res.send("ON")
    var c=q.current;
    var d = new Date();
    var ymd = d.getFullYear().toString()+"/"+(d.getMonth()+1).toString()+"/"+d.getDate().toString();
    await EnUse.insertMany({socketID: id.toString(), current: c, YMD: ymd, Hour: d.getHours(), Minute: d.getMinutes(), dateTime: d});
    console.log("inserted");
    // real time
    socketClient.emit("current",id,c);
    // real time
    
    return;
}
else{
    var id = temp[0].socketID;
    //if 1. not in db or 
    //   2. powerOn is false 
    //   3. no user Assigned
    res.send("OFF");
    console.log("it's turned off right now")
      // real time
      socketClient.emit("current",id,0);
      // real time
    return;
}


});


// router.get('/home', verify, (req,res)=>{
    
    
//     res.render('home',{name : req.cookies.user, lv: req.cookies.userLevel});
// });

router.get("/insertDailyForSocket", async function (req, res) {
    var year = 2020,
        month = 4,
        day = 10,
        use = 1000,
        time = 9,
        current = 15;
    var q = url.parse(req.url, true).query; //req.url = the full link to the website
    var id = parseInt(q.id);
    for (var i = 0; i < 7; ++i) {
        await daily.insertMany({
            socketID: id,
            year: year,
            month: month,
            day: day,
            totalUse: use,
        });
        var m = month;
        var d = new Date(year, m, day);
        console.log("month = " + d.getMonth());
        var ymd =
            d.getFullYear().toString() +
            "/" +
            d.getMonth().toString() +
            "/" +
            d.getDate().toString();
        await EnUse.insertMany({
            socketID: id,
            YMD: ymd,
            Hour: time,
            dateTime: d,
            current: current,
            switchOn: true,
        });

        if (i % 2 == 1) {
            use = 2000;
            time = 12;
            current = 18;
        } else {
            use = 1000;
            time = 9;
            current = 15;
        }
        day = day + 1;
    }
    res.send("insert finished");
});

router.get('/insertDailyPart2', async function (req, res) {
    var year = 2020, month = 4, day = 1, use = 1000, time = 9, current = 15;
    var q = url.parse(req.url, true).query; //req.url = the full link to the website
    var id = parseInt(q.id);
    for (var i = 0; i < 9; ++i) {
        await daily.insertMany({ socketID: id, year: year, month: month, day: day, totalUse: use });
        var m = month;
        var d = new Date(year, m, day);
        console.log("month = " + d.getMonth())
        var ymd = d.getFullYear().toString() + "/" + d.getMonth().toString() + "/" + d.getDate().toString();
        await EnUse.insertMany({ socketID: id, YMD: ymd, Hour: time, dateTime: d, current: current, switchOn: true });

        if (i % 2 == 1) {
            use = 2000;
            time = 12;
            current = 18;
        }
        else {
            use = 1000;
            time = 9;
            current = 15;
        }
        day = day + 1;
    }
    res.send("insert finished")

});

router.get('/insertDailyPart3', async function (req, res) {
    var year = 2020, month = 3, day = 16, use = 1000, time = 9, current = 15;
    var q = url.parse(req.url, true).query; //req.url = the full link to the website
    var id = parseInt(q.id);
    for (var i = 0; i < 16; ++i) {
        await daily.insertMany({ socketID: id, year: year, month: month, day: day, totalUse: use });
        var m = month;
        var d = new Date(year, m, day);
        console.log("month = " + d.getMonth())
        var ymd = d.getFullYear().toString() + "/" + d.getMonth().toString() + "/" + d.getDate().toString();
        await EnUse.insertMany({ socketID: id, YMD: ymd, Hour: time, dateTime: d, current: current, switchOn: true });

        if (i % 2 == 1) {
            use = 2000;
            time = 12;
            current = 18;
        }
        else {
            use = 1000;
            time = 9;
            current = 15;
        }
        day = day + 1;
    }
    res.send("insert finished")
});
// router.get('/temp', async function(req,res){
//     var q=url.parse(req.url,true).query;
//     var id=(q.id).toString();
//     var d1 = new Date(2020,3,10);    var d2 = new Date(2020,3,11);    var d3 = new Date(2020,3,12);    var d4 = new Date(2020,3,13);
//     var ymd1 = "2020/4/10"; var ymd2 = "2020/4/11";var ymd3 = "2020/4/12";var ymd4 = "2020/4/13";
//     await daily.insertMany({socketID: id, year: 2020, month:4, day:10,totalUse: 1000});
//     await daily.insertMany({socketID: id, year: 2020, month:4, day:11,totalUse: 1200})
//     await daily.insertMany({socketID: id, year: 2020, month:4, day:12,totalUse: 1100});
//     await daily.insertMany({socketID: id, year: 2020, month:4, day:13,totalUse: 1250});


//     await EnUse.insertMany({socketID: id, dateTime: d1, YMD: ymd1, Hour: 9,current: 15});
//     await EnUse.insertMany({socketID: id, dateTime: d2, YMD: ymd2, Hour:10,current:18});
//     await EnUse.insertMany({socketID: id, dateTime: d3, YMD: ymd3, Hour:12,current:16});
//     await EnUse.insertMany({socketID: id, dateTime: d4, YMD: ymd4, Hour:10,current:18});

//     res.send("inserted")
// })

router.get('/schedule', async function(req,res){
var d = new Date(2020,4,2,11,3);//month =4 means May
var j = schedule.scheduleJob(d, function(){
    console.log('現在時間：',new Date());
    })
    res.send("schedule completed");
});



process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
      console.log('Http server closed.');
      // boolean means [force], see in mongoose doc
      mongoose.connection.close(false, () => {
        console.log('MongoDb connection closed.');
        process.exit(0);
      });
    });
});