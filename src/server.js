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

const router = express.Router();
const dotenv = require('dotenv');
const verify = require('./routes/verifyToken');
const cookieParser = require('cookie-parser');
const loginRedirect = require('./routes/loginRedirect');
const daily=require('./models/dailyUsage');

const verifyAdmin = require('./routes/verifyAdmin');
const models = db.models;
// var Socket =  models.Socket; 
var EnergyUse =  models.EnergyUse; 
// var users = models.Users;

// Get Router
const authRouter = require('./routes/auth');
const powerRouter = require('./routes/powerUse');
const adminRouter = require('./routes/adminSetting');
const officeRouter = require('./routes/office');
const planRouter = require('./routes/powerPlan');

dotenv.config({path:'./src/.env'});

router.get('/',loginRedirect, async function(req, res){
    // res.sendFile(path.join(__dirname,'../','public','index.html'))
    // res.redirect('./home');

    // var attachedSockID = req.cookies.attachedSockID;
    
    var attachedSock = await Socket.findOne({userName: req.cookies.user, 
        attached:true});
    if (attachedSock) {
      console.log(
        req.cookies.user + " has attached socket: " + attachedSock.socketID
      );
    }
    
    var found = 0;
    var mySocket = await Socket.find({userName: req.cookies.user});
    // console.log(mySocket);
    if (mySocket){
        for (const socket of mySocket) {
            // console.log(socket.socketID);
        }
    }
    res.render('home',{name : req.cookies.user,
        lv: req.cookies.userLevel, mySocket: mySocket,
        haveSocket:found, attachedSock:attachedSock});
});

router.post('/attach',verify, async function(req, res){
    if(req.cookies.attachedSockID){
        var attachedSock = await Socket.findOneAndUpdate(
            {userName: req.cookies.user, 
            socketID : req.cookies.attachedSockID},
            { $set: { "attached" : false}}
            );
        res.clearCookie('attachedSockID');
    }
    var socketID = req.body.atSock;
    console.log(req.cookies.user+" attach socket: "+socketID);
    var newSock = await Socket.findOneAndUpdate(
        {userName: req.cookies.user, 
        socketID : socketID},
        { $set: { "attached" : true}},
        function(err){
            if (err)
            console.log("notfound");
        });
    res.cookie('attachedSockID', socketID);
    res.redirect('/');
});

router.post('/removeSocket',verify, async function(req, res){
    var attachedSock = await Socket.findOneAndUpdate(
        {userName: req.cookies.user, 
        socketID : req.cookies.attachedSockID},
        { $set: { "attached" : false}}
        );
    console.log(req.cookies.user+" remove attached socket: "+req.cookies.attachedSockID);
    res.clearCookie('attachedSockID');
    res.redirect('/');
});

//save the data sent from Arduino
app.get('/readings', function(req, res){
    //var line = req.params.id;
    //console.log(line);
    var q=url.parse(req.url,true).query; //req.url = the full link to the website
    var name=q.name;
    var current=q.current;
    var id = q.id
    var d = new Date();
    var ymd = d.getFullYear.toString()+"/"+(d.getMonth()+1).toString()+d.getDate().toString();
    var json1 = new EnergyUse({socketID:id, current: current, switchOn :true, 
        YMD: ymd,
        Hour: d.getHours(), 
        Minute: d.getMinutes(),
        dateTime: d
    });
    
    json1.save(function(err){
        console.log('try');
        if(err)
        console.log('cant insert');
        else
        console.log('data inserted');
        
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.send(id+" "+name+" has used "+current+"A already!"); 
});

router.get('/io',(req, res)=>{
    res.render('io');
});

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

const server = app.listen(5000,function(){
    console.log("start listening at port 5000");
});

var io = require('socket.io')(server);
require('./io.js')(io);

// io.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.on('test', (data) => {
//         var string = data;
//       console.log(string);
//     });

//   });

// router.get('/home', verify, (req,res)=>{
    
    
//     res.render('home',{name : req.cookies.user, lv: req.cookies.userLevel});
// });



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