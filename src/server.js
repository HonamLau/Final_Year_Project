const http = require("http");
const session = require("express-session");
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const path = require('path');
const db = require('./models/db');
const Sockett=require('./models/Socket')
const bodyParser = require('body-parser');
const url = require('url');
const mongoose = require('mongoose');

const router = express.Router();
const dotenv = require('dotenv');
const verify = require('./routes/verifyToken');
const cookieParser = require('cookie-parser');
const loginRedirect = require('./routes/loginRedirect');
const daily=require('./models/dailyUsage');


const models = db.models;
var Socket =  models.Socket; 
var EnergyUse =  models.EnergyUse; 

// Get Router
const authRouter = require('./routes/auth');
const powerRouter = require('./routes/powerUse');
const adminRouter = require('./routes/adminSetting');
const officeRouter = require('./routes/office');
const planRouter = require('./routes/powerPlan');

dotenv.config({path:'./src/.env'});

router.get('/',loginRedirect, function(req, res){
    // res.sendFile(path.join(__dirname,'../','public','index.html'))
    // res.redirect('./home');
    res.render('home',{name : req.cookies.user, lv: req.cookies.userLevel});
});
router.get('/lookup',verify,async (req,res)=>{
    console.log('wants to lookup')
    console.log("cookies's username: "+ req.cookies.user);

const socID=await Sockett.find({
    userName:req.cookies.user
},{
    socketID:1
});
//get the socketID of the current user's
const ID=socID[0].socketID;
//count how many datas of this ID is in dailyUsage.
const countOfDataInDaily=await daily.find({
    socketID: ID
}).countDocuments();
if(countOfDataInDaily>7){
    countOfDataInDaily=7;
}
//search for the data in dailyusage, by ID
const usageData=await daily.find({socketID: ID},{
    year:1, month:1,day:1,totalUse:1, _id:0
}).sort({year:-1,month:-1,day:-1}).limit(countOfDataInDaily);
//put the data in array:
var data=[];
// for(var i=0;i<countOfDataInDaily;++i){
//     var date=usageData[i].year.toString()+usageData[i].month.toString()+"/"+usageData[i].day.toString();
//     var use=usageData[i].totalUse;
//     data.push(usageData[i]);
//     console.log(data[i]);
// }
for(var i=0;i<7;++i){
    if(i<countOfDataInDaily){
     var date=usageData[i].year.toString()+"/"+usageData[i].month.toString()+"/"+usageData[i].day.toString();
         var use=parseInt(usageData[i].totalUse);
data.push([date,use]);}
else{
    var x="/";
    var y=null;
    data.push([x.toString(),parseInt(y)]);
}
}
console.log("date: " + data[0][0]); console.log("use: "+data[0][1]);



    res.render('stats',{datas:data, loop:countOfDataInDaily});
})

 
//save the data sent from Arduino
app.get('/readings', function(req, res){
    //var line = req.params.id;
    //console.log(line);
    var q=url.parse(req.url,true).query; //req.url = the full link to the website
    var name=q.name;
    var current=q.current;
    var id = q.id
    
    var json1 = new EnergyUse({socketID:id, current: current, switchOn :true});
    
    json1.save(function(err){
        console.log('try');
        if(err)
        console.log('cant insert');
        else
        console.log('data inserted');
        
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(id+" "+name+" has used "+current+"A already!"); 
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
app.use('/powerPlan', planRouter);

// Set views
app.set('views',path.join(__dirname,'../','src','views'));
app.set('view engine', 'ejs',);
app.use('/styles',express.static(__dirname +'/styles'));

app.use('/js',express.static(__dirname +'/js'));


app.listen(5000,function(){
    console.log("start listening at port 5000");
});


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