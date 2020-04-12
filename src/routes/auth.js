const express = require('express');
const app = express();
const router = require('express').Router();
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const data=require('../models/Socket')

const redirectHome = (req,res, next)=>{
    if(req.session.userId){
         res.redirect('/home')
    }
    else
    next()
}


const {registerValidation, loginValidation} =  require('../validation');

// Register user Backend
router.get('/teststats',async(req,res)=>{
    const today=new Date();
    const stats=new data({
        socketID: 0,
        minCurrent: 0,
        maxCurrent: 100,
        userName:"phsze2"
        
    })
    try{
        const savedData = await stats.save((err)=>{
            if(err){
            console.log('cannot insert');
            console.log(err);
        }
            else
            console.log('data inserted');
        });
    }catch(err){
        res.status(400).send(err);
    }   
    res.send('inserted! :D')
})
router.post('/login', async (req,res) => {
    console.log('logging in');
    const {error} =loginValidation(req.body);
    // validation
    if (error){
        console.log('validation error');
        return res.render('login',{validation: error.details[0].message});
    }
    // find user in db
    console.log(req.body.Username);
    console.log(req.body.Password);
    const existedUser = await Users.findOne({
        userName :  req.body.Username
    });
    // no match user
    if (!existedUser){
        console.log('not exist');
        return res.render('login', {error: 'Username or Password is wrong!'});
    }
    
    //validating password
    validPassword = await bcrypt.compare(req.body.Password, existedUser.userPassword);
    if(!validPassword){
        console.log('wrong pw');
        return res.render('login', {error: 'Username or Password is wrong!'});
    }
    else{ 
        // create webtoken for login
        const token = jwt.sign({_id: existedUser._id}, process.env.TOKEN_SECRET);
        res.cookie('user',req.body.Username);
        res.cookie('authToken',token);
        res.cookie('userLevel', existedUser.roleLevel);
        //redirect
        
        res.redirect('../');
    }
});
router.post('/register', async (req,res) => {
    console.log('register');
    // register validation
    const {error} =registerValidation(req.body);
    if (error){
        console.log('validation error');
        return res.render('register',{validation: error.details[0].message});
    }
    var roleName = 'User';
    const roleLevel = req.body.roleLevel;
    if (roleLevel>=5){
        const passcode = req.body.Passcode;
        console.log(req.body.Passcode);
        if (passcode == 'manager' && roleLevel == 5){  
            roleName = 'Manager';
        }else if (passcode == 'admin' && roleLevel == 10){
            roleName = 'Administrator';
        }else{
            console.log('wrong  passcode');
            return res.render('register',{validation: 'Wrong Passcode'});
        }
    }
    // Find user in Database
    const existedUser = await Users.findOne({
        userName :  req.body.Username
    });
    if (existedUser){
        console.log('exist');
        return res.render('register',{exist :'User already exist !'});
    };

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.Password, salt);

    // Create new user
    const user = new Users({
        userName : req.body.Username,
        userPassword : hashPassword,
        name : req.body.Name,
        roleName : roleName,
        roleLevel : req.body.roleLevel,
        email: req.body.Email
    });    
    
    // Save User
    try{
        const savedUser = await user.save((err)=>{
            if(err){
            console.log('cannot insert');
            console.log(err);
        }
            else
            console.log('data inserted');
        });
        return res.render('register',{success :'Successfully created user !'});
    }catch(err){
        res.status(400).send(err);
    }   

});

router.get('/logout', (req,res) =>{
    res.clearCookie('user');
    res.clearCookie('authToken');
    res.redirect('login');
});
router.get('/register',(req,res)=>{
    // res.render('../src/views/register.ejs');
    res.render('register');
});
router.get('/login',(req,res)=>{
    //res.removeHeader('../src/views/login.ejs');
    res.render('login');
});

router.get('/powerUsed',(req,res)=>{
//need to check if user has logged in
//maybe encrypt and decrypt the username here.
});
router.get('/t',(req,res)=>{
    res.render('adminHome');
})


module.exports = router;