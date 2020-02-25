const http = require("http");
const session = require("express-session");
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const path = require('path');
const db = require('./models/db');

const bodyParser = require('body-parser');
const url = require('url');
const mongoose = require('mongoose');

const router = express.Router();
const dotenv = require('dotenv');
const verify = require('./routes/verifyToken');
const cookieParser = require('cookie-parser');
const loginRedirect = require('./routes/loginRedirect');



const models = db.models;
var Socket =  models.Socket; 

// Get Router
const authRouter = require('./routes/auth');
const powerRouter = require('./routes/powerUse');
const adminRouter = require('./routes/adminSetting');
const officeRouter = require('./routes/office');

dotenv.config({path:'./src/.env'});

router.get('/',loginRedirect,function(req, res){
    // res.sendFile(path.join(__dirname,'../','public','index.html'))
    res.redirect('./home');
});

//save the data sent from Arduino
app.get('/readings', function(req, res){
    //var line = req.params.id;
    //console.log(line);
    var q=url.parse(req.url,true).query; //req.url = the full link to the website
    var name=q.name;
    var voltage=q.voltage;
    
    var json1 = new Socket({socketID:100, Name: name, Voltage: voltage});
    
    json1.save(function(err){
        console.log('try');
        if(err)
        console.log('cant insert');
        else
        console.log('data inserted');
        
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(name+" has used "+voltage+"V already!"); 
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
app.ws('/echo', function(ws, req) {
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});

app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    console.log('socket', req.testing);
});
// --------WebSocket------------

// Set Router
app.use('/',router);
app.use('/auth', authRouter);
app.use('/powerUse', powerRouter);
app.use('/adminSetting', adminRouter);
app.use('/office', officeRouter);

// Set views
app.set('views',path.join(__dirname,'../','src','views'));
app.set('view engine', 'ejs',);



app.listen(5000,function(){
    console.log("start listening at port 5000");
});


router.get('/home', verify, (req,res)=>{
    console.log(req.cookies.userLevel);
    console.log(req.cookies.user);
    
    res.render('home',{name : req.cookies.user, lv: req.cookies.userLevel});
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