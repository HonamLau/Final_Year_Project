const express = require('express');
const app=express();
const db = require('./models/db');
const mongoose = require('mongoose');
const model=db.models;
const Users=model.Users;
const expressWs = require('express-ws')(app);

var user_name, pass_word,user_id,real_name,role_name,role_level;

// app.set('views', './views');
 app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false})); //enable to get the form filled in info from "request" parameter of POST method

// app.get('/',function(request,response){

// response.render('indexx.ejs')
// });

app.get('/register', (req,res)=>{
    res.render('register.ejs'); 
});
app.post('/register',(req,res)=>{
    
});

app.get('/login',(req,res)=>{
    res.render('login.ejs');
});

app.post('/login',(req,res)=>{
    res.send('Welcome back ' + req.body.name);
});

app.post('/register',async (req,res)=>{
    try{
    console.log('posting');
    user_id=req.body.userId;
    user_name=req.body.Username;
    pass_word=req.body.password;
    real_name=req.body.name;
    role_name=req.body.roleNamel;
    role_level=req.body.roleLevel;
    console.log(user_id);
    //email=req.body.email;
    var myobj=new Users({userId:user_id,userName:user_name,userPassword:pass_word,name:real_name,roleName:role_name,roleLevel:role_level});
    myobj.save(function(err){
        console.log('try');
        if(err)
        console.log('cant insert');
        else
        console.log('data inserted');
        
    });
res.send('user created!'); res.redirect('/login')}
catch{
    res.redirect('/register');
};

})

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
app.listen(5000);